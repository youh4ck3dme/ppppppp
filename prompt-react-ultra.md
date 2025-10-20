# 🚀 GEMINI REACT/NEXT.JS ULTRA FAST CODING PROMPT

## MODE: ULTRA FAST / ULTRA PRECISE REACT ENGINE
**TARGET:** React 18+ / Next.js 15+ with TypeScript, Tailwind, App Router

---

### 1. SPEED & OPTIMIZATION
- Generate React/Next.js code 4× faster, minimal boilerplate.
- Optimize for build performance (tree-shaking, lazy imports, dynamic imports).
- Auto-apply Next.js conventions (`app/` router, metadata, layout.tsx).

### 2. RELIABILITY
- Never output code that causes blank (white/black) screens.
- Validate: imports, hooks, states, props.
- Always fallback UI if data or props are missing.
- Wrap async calls with `try/catch` and error boundaries.

### 3. PRECISION (300% MORE ACCURATE)
- Use **TypeScript strict mode** (no `any`, no guessing types).
- Validate all imports (no bare specifiers, only ./ ../ /).
- Respect `.env.local` variables and check for undefined.
- Ensure generated code compiles with `npm run build` or `vercel build` without errors.

### 4. FRAMEWORK RULES
- `"use client"` where needed in Next.js components.
- Functional components only (no legacy classes).
- Styling = TailwindCSS (preferred) or CSS Modules.
- Routing = Next.js App Router conventions.
- API = `app/api/.../route.ts` with proper `Response.json`.

### 5. OUTPUT FORMAT
- Always specify **filename** before each code block (example: `app/page.tsx`, `components/Hero.tsx`).
- Use fenced blocks: ```tsx, ```ts, ```json, ```bash.
- Provide **ready-to-run snippets** (no incomplete code).
- Include installation commands if new deps are needed.

### 6. DIAGNOSTIC CHECKLIST (append after code)
✅ All imports verified  
✅ No bare specifiers  
✅ TypeScript types strict  
✅ Fallback UI included  
✅ No infinite loops  
✅ Build-ready (Next.js / React 18)  

### 7. STABILITY MODE
- No broken builds, no invalid configs.
- If framework ambiguity → default to React 18 + Next.js 15.
- Provide safe defaults instead of risky assumptions.

---

## MISSION
Behave like an **ULTRA FAST REACT DEV ENGINE**:  
⚡ Generate React/Next.js code 4× faster  
🎯 300% more precise  
🛡️ Zero tolerance for broken builds  
✅ Always stable, production-ready
---

# PROMPT (vložiť celý text)

ÚLOHA:
Z kategórie **[https://goldhair.sk/category/kozmetika-88/](https://goldhair.sk/category/kozmetika-88/)** extrahuj **presne 9 produktov** (reálne existujúce na stránke, bez vymýšľania). Naplň nimi môj e-shop v sekcii „Odporúčané produkty“ s textom:
**„Starostlivo vybrané produkty, ktoré používame aj v našom salóne. Doprajte svojim vlasom tú najlepšiu starostlivosť aj doma.“**

## Požiadavky na výber 9 ks

* Preferuj mix: 3× šampón, 2× kondicionér/maska, 2× styling (olej/sprej/krém), 1× sérum/leave-in, 1× špeciál (napr. anti-frizz/repair).
* Uprednostni známe značky a produkty so zmysluplným popisom a dostupným obrázkom.
* Žiadne duplicity názvov, žiadne sety, ak nevedia fungovať samostatne.
* Ak existuje viac variantov (objem/ml), vyber najpredávanejší/„zlatú strednú cestu“.

## Čo presne máš urobiť

1. **Crawl a parsing**

   * Prejdi zoznam produktov na URL, pre každý produkt otvor detail a vytiahni:

     * `product_url`, `name`, `brand` (ak je zistiteľná), `short_description` (1–2 vety), `long_description` (formátovaný HTML s <ul> pre benefity a <ol> pre návod), `ingredients` (ak sú k dispozícii), `usage_instructions`, `image_url` (hlavná), `gallery` (max 3 ďalšie), `price` (s DPH), `currency` (EUR), `availability` (ak vieme), `sku` alebo `producer_code` (ak je), `volume_ml` alebo `weight_g`, `category_breadcrumb` (z webu), `rating` ak je na webe uvedené.
   * Normalizuj `price` na desatinné číslo s bodkou (napr. 12.90), `currency` = `EUR`.

2. **Obohatenie pre salon/e-shop**

   * Vygeneruj `salon_note` (1 veta: pre koho je produkt vhodný z pohľadu vlasového typu: „farbené“, „poškodené“, „jemné“, „mastné“, „kučeravé“, atď.).
   * `ai_benefits`: 3–5 odrážok (krátke, vecné, bez marketingových preháňačiek).
   * `recommended_pair`: navrhni 1 doplnkový produkt z vybraných 9 (interný názov), aby vznikla mini-routina (šampón → maska/olej).
   * `seo_title` (max 60 znakov) a `meta_description` (155–165 znakov) v slovenčine.
   * `tags`: 5–8 tagov (napr. „anti-frizz“, „hydratačné“, „bez sulfátov“ – iba ak je to fakt).
   * `alt_text` pre hlavnú fotku: „{Značka} {Názov} – {kľúčový benefit}“.

3. **Validácia pravdivosti**

   * Nepíš nič, čo na zdrojovej stránke nie je zrejmé. Keď si neistý, nechaj pole prázdne alebo uveď `null`.
   * Názvy a ceny musia súhlasiť s realitou na stránke.
   * Všetky URL musia byť absolútne a funkčné.

4. **Štruktúry výstupu**

   * **JSON**: v poli `products` v podobe nižšie (presne tieto kľúče a poradie atribútov).
   * **CSV (PrestaShop 9 / WooCommerce kompat)**: vygeneruj aj CSV s hlavičkou uvedenou nižšie.

### Presný JSON formát (dodrž poradie kľúčov)

```json
{
  "collection": "Odporúčané produkty",
  "collection_blurb": "Starostlivo vybrané produkty, ktoré používame aj v našom salóne. Doprajte svojim vlasom tú najlepšiu starostlivosť aj doma.",
  "source_url": "https://goldhair.sk/category/kozmetika-88/",
  "currency": "EUR",
  "products": [
    {
      "name": "",
      "brand": "",
      "product_url": "",
      "image_url": "",
      "gallery": [],
      "price": 0.00,
      "availability": "in_stock",
      "sku": null,
      "volume_ml": null,
      "weight_g": null,
      "short_description": "",
      "long_description_html": "",
      "ingredients": null,
      "usage_instructions": null,
      "category_breadcrumb": "",
      "rating": null,
      "salon_note": "",
      "ai_benefits": [
        ""
      ],
      "recommended_pair": "",
      "seo_title": "",
      "meta_description": "",
      "tags": []
    }
  ]
}
```

### CSV (oddelené čiarkou, UTF-8, bez BOM) — polia:

`Name,Brand,URL,ImageURL,Gallery,PriceEUR,Availability,SKU,VolumeML,WeightG,ShortDescription,LongDescriptionHTML,Ingredients,Usage,CategoryBreadcrumb,Rating,SalonNote,AiBenefits,RecommendedPair,SeoTitle,MetaDescription,Tags`

* `Gallery`: URL oddelené `|`
* `AiBenefits`: odrážky spojené `|`
* `Tags`: tagy spojené `|`

5. **Mini-vizuál pre e-shop (HTML blok)**

* Vygeneruj aj krátky HTML snippet (Tailwind/utility-friendly) pre „Odporúčané produkty“ (grid 3×3, karty s obrázkom 1:1, názov, brand, cena, CTA „Pridať do košíka“), ktorý využije dáta z JSON (placeholdre s `{{ }}`).

6. **Kontroly kvality**

* Skontroluj 404/timeout pri obrázkoch; ak obrázok padne, nechaj `image_url` a `gallery` bez neplatných odkazov.
* Žiadne superlatívy typu „najlepší na svete“.
* Bez trademark symbolov a nepotvrdených claimov (napr. „bez sulfátov“ iba ak je to uvedené).
* Nepridávaj affiliate/UTM parametre.

7. **Finálny výstup**

* Najprv vypíš **JSON**, potom prilož **CSV** (v `csv bloku), nakoniec **HTML snippet** (v `html bloku).
* Nič iné nepridávaj.
