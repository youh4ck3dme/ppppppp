### Prompt 1: Odstránenie ikony prihlásenia

**Cieľ:** Odstrániť ikonu pre prihlásenie administrátora z hlavičky webstránky.

**Kontext:** V súbore `components/Header.tsx` sa nachádza `button`, ktorý obsahuje ikonu s `id="user"`. Tento prvok slúži na navigáciu na prihlasovaciu stránku (`/admin`) alebo na profil (`/profile`).

**Úloha:**
1.  Otvorte súbor `components/Header.tsx`.
2.  Nájdite a kompletne odstráňte nasledujúci blok kódu:
    ```jsx
    <button onClick={() => onNavigate({ view: isAuthenticated ? 'profile' : 'admin' })} className="icon-btn" aria-label={isAuthenticated ? t('profile_button_aria_view') : t('profile_button_aria_login')}>
        <Icon id="user" className="w-6 h-6" />
    </button>
    ```
3.  Uložte zmeny v súbore. Ikona by po tejto úprave mala zmiznúť z hlavičky webstránky.

*(Poznámka: Túto úlohu som už vykonal v predchádzajúcich krokoch, ale tu je prompt, ako ste si želali.)*

---

### Prompt 2: Vylepšenie responzivity

**Cieľ:** Dosiahnuť vynikajúcu (pixel-perfect) responzivitu webstránky "Papi Hair Design" na všetkých typoch zariadení, od malých mobilných telefónov až po široké desktopy.

**Technológie:** Projekt používa React a **Tailwind CSS**, čo je kľúčový nástroj pre túto úlohu.

**Postup:**
1.  **Audit existujúceho stavu:** Systematicky prejdite všetky sekcie a komponenty aplikácie (Hero, Cenník, O nás, Galéria, Pätička atď.) na rôznych šírkach obrazovky pomocou vývojárskych nástrojov v prehliadači. Identifikujte všetky vizuálne problémy:
    *   Text, ktorý preteká mimo svojho kontajnera.
    *   Prvky, ktoré sa nesprávne prekrývajú.
    *   Nevhodné veľkosti písma a obrázkov na malých obrazovkách.
    *   Nekonzistentné medzery a zarovnanie.
2.  **Fluidný dizajn:** Namiesto pevných breakpointov pre konkrétne zariadenia sa zamerajte na plynulé prispôsobenie. Použite responzívne prefixy Tailwind CSS (`sm:`, `md:`, `lg:`, `xl:`) na postupné úpravy layoutu.
3.  **Kľúčové oblasti na zameranie:**
    *   **Navigácia/Hlavička:** Zabezpečte, aby mobilné menu fungovalo bezchybne a hlavné navigačné odkazy boli na desktope správne zarovnané.
    *   **Grid a Flexbox:** Skontrolujte a upravte všetky `grid` a `flex` kontajnery tak, aby sa ich obsah elegantne zalamoval na menších obrazovkách. Použite `flex-wrap` a zmeňte `flex-direction` z `row` na `col` podľa potreby.
    *   **Typografia:** Upravte veľkosť textu (`text-sm`, `md:text-base`, `lg:text-lg`) pre optimálnu čitateľnosť na každom zariadení.
    *   **Obrázky:** Zabezpečte, aby sa obrázky správne škálovali a neprekračovali šírku svojho rodičovského prvku. Zvážte použitie `object-fit` na orezanie obrázkov tam, kde je to vhodné.
4.  **Testovanie:** Po každej významnejšej úprave opätovne testujte na rôznych šírkach. Zamerajte sa na najbežnejšie breakpointy: 360px (mobil), 768px (tablet) a 1280px+ (desktop).

---

### Prompt 3: Vylepšenie prihlásenia a Admin Dashboard

**Téma:** Návrh a implementácia komplexného administračného rozhrania pre aplikáciu "Papi Hair Design".

**Cieľ:** Vytvoriť zabezpečenú a intuitívnu platformu na adrese `/admin`, ktorá umožní kompletnú správu obsahu, služieb a nastavení aplikácie bez nutnosti priameho zásahu do kódu.

**Požiadavky:**

**1. Bezpečné prihlásenie (`/admin`):**
   - Vytvorte minimalistickú, no profesionálne vyzerajúcu prihlasovaciu stránku s poľami pre e-mail a heslo.
   - Implementujte robustnú autentifikáciu (napr. Firebase Authentication).
   - Po úspešnom prihlásení presmerujte používateľa na hlavný panel (`/admin/dashboard`).

**2. Admin Dashboard (Hlavný panel):**
   - Vytvorte responzívny layout s bočným navigačným panelom pre jednoduchý prístup ku všetkým sekciám.
   - **Prehľad (Dashboard):** Zobrazte súhrnné informácie a rýchle metriky:
     - Počet rezervácií za posledný mesiac (s prepojením na Bookio).
     - Najčastejšie objednávané služby.
     - Rýchle akcie (napr. "Pridať novú službu", "Upraviť galériu").

**3. Správa Služieb (Cenník):**
   - Vytvorte CRUD (Create, Read, Update, Delete) rozhranie na správu všetkých služieb.
   - Umožnite administrátorovi:
     - Pridávať, upravovať a mazať kategórie služieb (Dámy, Páni).
     - Pridávať, upravovať a mazať jednotlivé služby v rámci kategórií.
     - Meniť **názov**, **cenu** a **popis** každej služby.
   - Zmeny musia byť automaticky prepojené so súbormi `constants.ts` a `translations.ts` a okamžite sa prejaviť na verejnej stránke.

**4. Správa Obsahu (CMS):**
   - Vytvorte editor na úpravu textového obsahu hlavných sekcií stránky:
     - Texty v "Hero" sekcii.
     - Popisky v sekcii "O nás".
     - Biografie členov tímu.
   - Editor musí podporovať úpravu pre oba jazyky (SK/EN) a zmeny ukladať do `translations.ts`.

**5. Globálne Nastavenia Aplikácie:**
   - Vytvorte formulár, kde je možné jednoducho meniť:
     - Kontaktné informácie (telefón, e-mail, adresa).
     - Odkazy na sociálne siete.
     - URL pre rezervačný systém Bookio.
