// Helper to convert data URL to File object, required for FormData
function dataURLtoFile(dataurl: string, filename: string): File | null {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

async function fetchImageAsBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export const editImageWithDallE = async (
    base64ImageData: string,
    prompt: string,
    apiKey: string
): Promise<{ data: string | null; error: string | null }> => {
    try {
        if (!apiKey) {
            return { data: null, error: "vto_error_no_openai_api_key" };
        }

        const imageFile = dataURLtoFile(base64ImageData, 'source_image.png');
        if (!imageFile) {
            return { data: null, error: "api_unexpectedError" };
        }
        
        // DALL-E 2 edits endpoint requires a square transparent mask. We are not using a mask, so let's try DALL-E 3 via chat completions if edits fail or is not ideal.
        // For simplicity here, we assume the edits endpoint. A more advanced implementation might use DALL-E 3 with the image as input.
        // Let's stick with the 'edits' endpoint as requested.
        
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('prompt', `A photorealistic edit of the person's hairstyle to be: "${prompt}". Do not change their face, expression, or the background. Ensure the new hair blends naturally with the original photo's lighting and head shape.`);
        formData.append('n', '1');
        formData.append('size', '1024x1024');

        const response = await fetch('https://api.openai.com/v1/images/edits', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error from OpenAI API:', errorData);
             if (response.status === 401) {
                return { data: null, error: "vto_error_bad_openai_key" };
            }
            if (response.status === 429) {
                return { data: null, error: "vto_error_openai_quota" };
            }
            return { data: null, error: errorData.error?.message || "api_unexpectedError" };
        }

        const result = await response.json();
        const imageUrl = result.data[0].url;

        // The app expects a base64 string, so we need to fetch the image from the URL and convert it.
        const finalBase64 = await fetchImageAsBase64(imageUrl);

        // We only need the base64 part of the data URL
        return { data: finalBase64.split(',')[1], error: null };

    } catch (error: any) {
        console.error('Error editing image with OpenAI API:', error);
        // This specifically catches network errors like CORS failures.
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            return { data: null, error: "vto_error_openai_network" };
        }
        return { data: null, error: "api_unexpectedError" };
    }
};