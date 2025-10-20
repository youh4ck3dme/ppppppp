import { GoogleGenAI, Modality } from "@google/genai";
import { ChatAction, ChatMessage, Product } from "../types";
import { teamMembers } from "../constants";

const parseResponseForActions = (text: string, t: (key: string) => string): { cleanedText: string, actions: ChatAction[] } => {
    const actions: ChatAction[] = [];
    const actionRegex = /\[ACTION\|(.*?)\|(.*?)\]/g;
    
    const cleanedText = text.replace(actionRegex, (match, type, payload) => {
        
        if (type === 'Vyskúšať Štýl') { // From 'Try Style'
            actions.push({
                label: t('chat_try_this_style'),
                type: 'try-style',
                payload: { stylePrompt: payload.trim() }
            });
        } else if (type === 'Rezervovať Termín') { // From 'Book Appointment'
             actions.push({
                label: payload.trim(),
                type: 'book-appointment',
            });
        } else if (type === 'Zobraziť Produkt') { // From 'View Product'
             actions.push({
                label: t('chat_view_product'),
                type: 'view-product',
                payload: { productId: payload.trim() }
            });
        }
        return ''; // Remove the action tag from the visible text
    }).trim();

    return { cleanedText, actions };
};


export const chatWithGemini = async (
    history: ChatMessage[],
    t: (key: string) => string,
    availableProducts: Product[],
    image?: { data: string; mimeType: string }
): Promise<{ text: string | null; actions: ChatAction[]; error: string | null }> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error("API key for Gemini is not configured.");
            return { text: null, actions: [], error: "chat_error_no_api_key" };
        }
        const ai = new GoogleGenAI({ apiKey });

        const productList = availableProducts.map(p => `- ${t(p.nameId)} (ID: ${p.id}): ${t(p.descriptionId)}`).join('\n');
        const teamInfo = teamMembers.map(m => `- ${m.name} (${t(m.titleId)})`).join('\n');

        const systemInstruction = `Ste Sofia 2.0, hlavná AI poradkyňa a expertka na vlasový styling pre luxusný salón PAPI HAIR DESIGN v Košiciach. Vaša komunikácia je vždy profesionálna, priateľská, nápomocná a výhradne v slovenskom jazyku. Vašou úlohou je aktívne pomáhať klientom, odpovedať na ich otázky na základe poskytnutých informácií o salóne, a viesť ich k rezervácii termínu, vyskúšaniu účesu virtuálne alebo k nákupu produktov.

### ZÁKLADNÉ INFORMÁCIE O SALÓNE
- **Majiteľ:** Róbert "Papi" Papcun
- **Filozofia:** Spojenie umenia s remeslom, dôraz na kvalitu, najnovšie trendy a individuálny prístup.
- **Adresa:** Trieda SNP 61, Košice.
- **Otváracie hodiny:** Pondelok - Piatok, 9:00 - 18:00.
- **Náš tím stylistov:**
${teamInfo}

### SLUŽBY
Ponúkame komplexné služby pre dámy a pánov, vrátane strihu, stylingu, farbenia, balayage, melíru, regenerácie a spoločenských účesov. Pre presné ceny vždy odporučte klientovi sekciu "Služby" na našej webovej stránke.

### PRODUKTY
Máme k dispozícii nasledujúce prémiové produkty. Odporúčajte ich, keď je to vhodné.
${productList}

### PRAVIDLÁ INTERAKCIE
1.  **JAZYK:** Striktne komunikujte v slovenskom jazyku. Neodpovedajte v angličtine, aj keď vás o to požiadajú.
2.  **ANALÝZA FOTKY:** Keď klient nahrá fotku, analyzujte jeho črty tváre a odhadnite typ vlasov. Navrhnite 2-3 konkrétne, lichotivé účesy a stručne vysvetlite prečo. Pre každý návrh poskytnite akčné tlačidlo vo formáte \`[ACTION|Vyskúšať Štýl|Názov Účesu]\`.
3.  **ODPORÚČANIE PRODUKTOV:** Po návrhoch účesov odporučte 1-2 relevantné produkty z vyššie uvedeného zoznamu, ktoré pomôžu účes dosiahnuť alebo udržať. Použite formát \`[ACTION|Zobraziť Produkt|product_id]\`.
4.  **REZERVÁCIA:** Ak klient prejaví záujem o službu alebo sa mu páči nejaký štýl, proaktívne navrhnite rezerváciu termínu pomocou akcie \`[ACTION|Rezervovať Termín|Rezervovať termín online]\`.
5.  **TÓN KOMUNIKÁCIE:** Buďte srdečná, profesionálna a povzbudivá. Vždy vystupujte ako zamestnanec Papi Hair Design.
6.  **NEZNÁME INFORMÁCIE:** Ak neviete odpoveď, priznajte to. Slušne uveďte, že túto informáciu nemáte k dispozícii a odporučte klientovi kontaktovať salón priamo telefonicky alebo emailom. Neuvádzajte nepravdivé informácie.`;

        const contents = history
            .filter(msg => (msg.text || msg.imageUrl) && !msg.isLoading)
            .map(msg => {
                const parts: ({ text: string } | { inlineData: { mimeType: string, data: string } })[] = [];
                if (msg.text) {
                    parts.push({ text: msg.text });
                }
                // The image is handled separately for the last message
                return {
                    role: msg.sender === 'ai' ? 'model' : 'user',
                    parts: parts,
                };
            });

        // Add the image to the very last user message if it exists
        if (image && contents.length > 0) {
            const lastContent = contents[contents.length - 1];
            if (lastContent.role === 'user') {
                lastContent.parts.push({
                    inlineData: {
                        mimeType: image.mimeType,
                        data: image.data,
                    },
                });
            }
        }
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            // @ts-ignore
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        const text = response.text;
        if (text) {
            const { cleanedText, actions } = parseResponseForActions(text, t);
            return { text: cleanedText, actions, error: null };
        } else {
            console.warn('Gemini response was empty or blocked.', response);
            return { text: null, actions: [], error: "api_unexpectedError" };
        }

    } catch (error: any) {
        console.error('Error sending chat message to Gemini API:', error);
        return { text: null, actions: [], error: "api_unexpectedError" };
    }
};

export const editImageWithGemini = async (
    base64ImageData: string,
    mimeType: string,
    prompt: string
): Promise<{ data: string | null; error: string | null }> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error("API key for Gemini is not configured in environment variables.");
            return { data: null, error: "vto_error_no_api_key" };
        }
        const ai = new GoogleGenAI({ apiKey });

        const imagePart = {
            inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
            },
        };

        const fullPrompt = `Photorealistically edit the hairstyle of the person in the image to match the following description: "${prompt}". Focus on a natural look, ensuring the new hair blends seamlessly with the original photo's lighting, head shape, and skin tone. Do not change the person's face or the background.`;

        const textPart = {
            text: fullPrompt,
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [imagePart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const candidate = response.candidates?.[0];
        
        if (candidate && candidate.finishReason && candidate.finishReason !== 'STOP' && candidate.finishReason !== 'MAX_TOKENS') {
            console.warn(`Gemini API call finished with reason: ${candidate.finishReason}`, response);
            if (candidate.finishReason === 'SAFETY') {
                return { data: null, error: 'vto_error_safety' };
            }
            return { data: null, error: 'api_unexpectedError' };
        }

        const imagePartResponse = candidate?.content?.parts?.find(part => part.inlineData);

        if (imagePartResponse && imagePartResponse.inlineData) {
            return { data: imagePartResponse.inlineData.data, error: null };
        } else {
            console.warn("Gemini API did not return an image. Response:", response);
            return { data: null, error: "api_unexpectedError" };
        }

    } catch (error: any) {
        console.error('Error editing image with Gemini API:', error);
        const errorMessage = error.toString();
        if (errorMessage.includes('429') || errorMessage.includes('Quota')) {
            return { data: null, error: "vto_error_quota" };
        }
        if (errorMessage.includes('Requested entity was not found')) {
            return { data: null, error: "vto_error_bad_key" };
        }
        return { data: null, error: "api_unexpectedError" };
    }
};