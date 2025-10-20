import { Visit, Purchase, Product, TeamMember } from './types';

export interface ServiceDetail {
  id: string;
  images: string[];
  processDescriptionTextId: string;
  durationTextId: string;
  bestForTextId: string;
}

export interface ProductDetail {
  id: string;
  images: string[];
  longDescriptionId: string;
  keyBenefitsId: string;
  howToUseId: string;
  suitableForId: string;
}

export const womensServices = [
    {
        categoryId: "womens_cut_styling",
        services: [
            { id: "womens_cut", price: 30.00 },
            { id: "blowdry_long", price: 30.00 },
            { id: "blowdry_medium", price: 20.00 },
            { id: "final_styling", price: 20.00 },
        ],
    },
    {
        categoryId: "womens_coloring",
        services: [
            { id: "color_cut_roots", price: 60.00 },
            { id: "color_roots", price: 45.00 },
            { id: "color_full", price: 70.00 },
            { id: "color_cut_full", price: 90.00 },
        ],
    },
    {
        categoryId: "womens_balayage_highlights",
        services: [
            { id: "balayage_full", price: 150.00 },
            { id: "balayage_retouch", price: 120.00 },
            { id: "highlights_roots", price: 120.00 },
            { id: "highlights_full", price: 150.00 },
        ],
    },
    {
        categoryId: "womens_bleaching_regeneration",
        services: [
            { id: "toner_cleansing", price: 100.00 },
            { id: "color_stripping", price: 160.00 },
            { id: "methamorphyc_quick", price: 35.00 },
            { id: "methamorphyc_exclusive", price: 50.00 },
            { id: "brazilian_keratin", price: 130.00 },
        ],
    },
    {
        categoryId: "womens_extensions_updos",
        services: [
            { id: "tape_in_application", price: 40.00 },
            { id: "tape_in_reapplication", price: 120.00 },
            { id: "braids", price: 30.00 },
            { id: "formal_updo", price: 40.00 },
        ],
    },
];

export const mensServices = [
     {
        categoryId: "mens_hair",
        services: [
            { id: "junior_cut", price: 15.00 },
            { id: "mens_cut", price: 19.00 },
        ],
    },
    {
        categoryId: "mens_beard_combos",
        services: [
            { id: "beard_trim", price: 12.00 },
            { id: "hair_beard_combo", price: 27.00 },
            { id: "mens_special_f", price: 40.00 },
            { id: "mens_special", price: 50.00 },
        ],
    },
    {
        categoryId: "mens_color",
        services: [
            { id: "perm", price: 50.00 },
            { id: "hair_lightening", price: 60.00 },
            { id: "beard_coloring", price: 20.00 },
            { id: "grey_blending", price: 25.00 },
        ],
    },
    {
        categoryId: "mens_addons",
        services: [
            { id: "nose_waxing", price: 8.00 },
            { id: "ear_waxing", price: 8.00 },
            { id: "ear_candles", price: 15.00 },
            { id: "peel_black_mask", price: 12.00 },
        ],
    }
];

export const serviceDetails: ServiceDetail[] = [
    {
        id: 'balayage_full',
        images: ['/assets/papi-ig-2.jpg', '/assets/papi-blog-colors.jpg', '/assets/papi-inspiration-rockstar.jpg'],
        processDescriptionTextId: 'service_process_balayage_full',
        durationTextId: 'service_duration_3_5_hours',
        bestForTextId: 'service_best_for_balayage_full'
    },
    {
        id: 'highlights_full',
        images: ['/assets/papi-inspiration-gatsby.jpg', '/assets/papi-alterego-popdiva.jpg', '/assets/papi-ig-4.jpg'],
        processDescriptionTextId: 'service_process_highlights_full',
        durationTextId: 'service_duration_3_4_hours',
        bestForTextId: 'service_best_for_highlights_full'
    },
    {
        id: 'color_stripping',
        images: ['/assets/papi-blog-5steps.jpg', '/assets/papi-blog-colors.jpg'],
        processDescriptionTextId: 'service_process_color_stripping',
        durationTextId: 'service_duration_4_plus_hours',
        bestForTextId: 'service_best_for_color_stripping'
    },
    {
        id: 'brazilian_keratin',
        images: ['/assets/papi-blog-gold.jpg', '/assets/papi-blog-5steps.jpg'],
        processDescriptionTextId: 'service_process_brazilian_keratin',
        durationTextId: 'service_duration_2_3_hours',
        bestForTextId: 'service_best_for_brazilian_keratin'
    }
];

export const teamMembers: TeamMember[] = [
    {
        id: 'papi',
        name: 'Róbert "Papi" Papcun',
        titleId: 'title_owner_stylist',
        bioId: 'bio_papi',
        image: '/assets/robert-papacun-portrait.jpg'
    },
    {
        id: 'julia',
        name: 'Júlia Vargová',
        titleId: 'title_color_specialist',
        bioId: 'bio_julia',
        image: '/assets/papi-ig-2.jpg'
    },
    {
        id: 'martin',
        name: 'Martin Horváth',
        titleId: 'title_junior_stylist',
        bioId: 'bio_martin',
        image: '/assets/papi-ig-3.jpg'
    }
];

export const products: Product[] = [
    {
        id: 'gold_hydration_shampoo',
        nameId: 'product_gold_hydration_shampoo_name',
        descriptionId: 'product_gold_hydration_shampoo_desc',
        price: 25.90,
        image: '/assets/product-gold-hydration-shampoo.jpg'
    },
    {
        id: 'kerastase_genesis_bain_hydra_fortifiant',
        nameId: 'product_kerastase_genesis_bain_hydra_fortifiant_name',
        descriptionId: 'product_kerastase_genesis_bain_hydra_fortifiant_desc',
        price: 26.50,
        image: '/assets/product-kerastase-genesis-shampoo.jpg'
    },
    {
        id: 'milkshake_color_maintainer_shampoo',
        nameId: 'product_milkshake_color_maintainer_shampoo_name',
        descriptionId: 'product_milkshake_color_maintainer_shampoo_desc',
        price: 16.20,
        image: '/assets/product-milkshake-color-shampoo.jpg'
    },
    {
        id: 'gold_hydration_conditioner',
        nameId: 'product_gold_hydration_conditioner_name',
        descriptionId: 'product_gold_hydration_conditioner_desc',
        price: 27.90,
        image: '/assets/product-gold-hydration-conditioner.jpg'
    },
    {
        id: 'olaplex_no5_conditioner',
        nameId: 'product_olaplex_no5_conditioner_name',
        descriptionId: 'product_olaplex_no5_conditioner_desc',
        price: 29.50,
        image: '/assets/product-olaplex-no5.jpg'
    },
    {
        id: 'kerastase_elixir_ultime_oil',
        nameId: 'product_kerastase_elixir_ultime_oil_name',
        descriptionId: 'product_kerastase_elixir_ultime_oil_desc',
        price: 42.00,
        image: '/assets/product-kerastase-elixir-oil.jpg'
    },
    {
        id: 'gold_ten_in_one',
        nameId: 'product_gold_ten_in_one_name',
        descriptionId: 'product_gold_ten_in_one_desc',
        price: 24.90,
        image: '/assets/product-gold-ten-in-one.jpg'
    },
    {
        id: 'olaplex_no6_bond_smoother',
        nameId: 'product_olaplex_no6_bond_smoother_name',
        descriptionId: 'product_olaplex_no6_bond_smoother_desc',
        price: 29.50,
        image: '/assets/product-olaplex-no6.jpg'
    },
    {
        id: 'olaplex_no3_hair_perfector',
        nameId: 'product_olaplex_no3_hair_perfector_name',
        descriptionId: 'product_olaplex_no3_hair_perfector_desc',
        price: 29.50,
        image: '/assets/product-olaplex-no3.jpg'
    }
];

export const productDetails: ProductDetail[] = products.map(p => ({
    id: p.id,
    images: [p.image],
    longDescriptionId: `${p.id}_long_desc`,
    keyBenefitsId: `${p.id}_benefits`,
    howToUseId: `${p.id}_usage`,
    suitableForId: `${p.id}_suitable_for`
}));


export const inspirationPromptsData = [
    {
        id: 'gatsby',
        image: '/assets/papi-inspiration-gatsby.jpg',
        titleId: 'inspiration_gatsby_title',
        descriptionId: 'inspiration_gatsby_desc',
        promptId: 'inspiration_gatsby_prompt'
    },
    {
        id: 'viking',
        image: '/assets/papi-inspiration-viking.jpg',
        titleId: 'inspiration_viking_title',
        descriptionId: 'inspiration_viking_desc',
        promptId: 'inspiration_viking_prompt'
    },
    {
        id: 'cyberpunk',
        image: '/assets/papi-inspiration-cyberpunk.jpg',
        titleId: 'inspiration_cyberpunk_title',
        descriptionId: 'inspiration_cyberpunk_desc',
        promptId: 'inspiration_cyberpunk_prompt'
    },
    {
        id: 'rockstar',
        image: '/assets/papi-inspiration-rockstar.jpg',
        titleId: 'inspiration_rockstar_title',
        descriptionId: 'inspiration_rockstar_desc',
        promptId: 'inspiration_rockstar_prompt'
    }
];

export const alterEgoPromptsData = [
    {
        id: 'agent',
        image: '/assets/papi-alterego-agent.jpg',
        titleId: 'inspiration_agent_title',
        descriptionId: 'inspiration_agent_desc',
        promptId: 'inspiration_agent_prompt'
    },
    {
        id: 'popdiva',
        image: '/assets/papi-alterego-popdiva.jpg',
        titleId: 'inspiration_popdiva_title',
        descriptionId: 'inspiration_popdiva_desc',
        promptId: 'inspiration_popdiva_prompt'
    },
    {
        id: 'romantic',
        image: '/assets/papi-alterego-romantic.jpg',
        titleId: 'inspiration_romantic_title',
        descriptionId: 'inspiration_romantic_desc',
        promptId: 'inspiration_romantic_prompt'
    },
    {
        id: 'elf',
        image: '/assets/papi-alterego-elf.jpg',
        titleId: 'inspiration_elf_title',
        descriptionId: 'inspiration_elf_desc',
        promptId: 'inspiration_elf_prompt'
    }
];

export const sosScenariosData = [
    {
        id: 'frizzy',
        iconId: 'sun' as const,
        titleId: 'vto_sos_frizzy_title',
        descriptionId: 'vto_sos_frizzy_desc',
        promptId: 'vto_sos_frizzy_prompt',
        relatedProductIds: ['serum'] as const
    },
    {
        id: 'lifeless',
        iconId: 'bar-chart' as const,
        titleId: 'vto_sos_lifeless_title',
        descriptionId: 'vto_sos_lifeless_desc',
        promptId: 'vto_sos_lifeless_prompt',
        relatedProductIds: ['shampoo', 'mousse'] as const
    },
    {
        id: 'badcut',
        iconId: 'scissors' as const,
        titleId: 'vto_sos_badcut_title',
        descriptionId: 'vto_sos_badcut_desc',
        promptId: 'vto_sos_badcut_prompt',
        relatedProductIds: ['mousse'] as const
    },
    {
        id: 'damaged',
        iconId: 'alert-triangle' as const,
        titleId: 'vto_sos_damaged_title',
        descriptionId: 'vto_sos_damaged_desc',
        promptId: 'vto_sos_damaged_prompt',
        relatedProductIds: ['conditioner', 'serum'] as const
    }
];

export const hairchangerStyles = [
    { id: 'w1', name: 'Long Wavy Layers', image: '/assets/papi-style-w-longwavy.jpg', category: 'women' as const },
    { id: 'w2', name: 'Chic Bob', image: '/assets/papi-style-w-bob.jpg', category: 'women' as const },
    { id: 'w3', name: 'Elegant Updo', image: '/assets/papi-style-w-updo.jpg', category: 'women' as const },
    { id: 'w4', name: 'Pixie Cut', image: '/assets/papi-style-w-pixie.jpg', category: 'women' as const },
    { id: 'w5', name: 'Curtain Bangs', image: '/assets/papi-style-w-curtainbangs.jpg', category: 'women' as const },
    { id: 'w6', name: 'Sleek Ponytail', image: '/assets/papi-style-w-ponytail.jpg', category: 'women' as const },
    { id: 'm1', name: 'Classic Taper Fade', image: '/assets/papi-style-m-taper.jpg', category: 'men' as const },
    { id: 'm2', name: 'Textured Crop', image: '/assets/papi-style-m-crop.jpg', category: 'men' as const },
    { id: 'm3', name: 'Slick Back', image: '/assets/papi-style-m-slickback.jpg', category: 'men' as const },
    { id: 'm4', name: 'Man Bun', image: '/assets/papi-style-m-manbun.jpg', category: 'men' as const },
    { id: 'm5', name: 'Buzz Cut', image: '/assets/papi-style-m-buzzcut.jpg', category: 'men' as const },
    { id: 'm6', name: 'Quiff', image: '/assets/papi-style-m-quiff.jpg', category: 'men' as const },
];

export const galleryImages: { src: string; alt: string }[] = [
    { src: '/assets/papi-inspiration-gatsby.jpg', alt: 'Elegantná modelka s retro vlnami v štýle 20. rokov.' },
    { src: '/assets/papi-alterego-popdiva.jpg', alt: 'Modelka s extravagantným vysokým copom v platinovej blond farbe.' },
    { src: '/assets/papi-style-w-longwavy.jpg', alt: 'Modelka s dlhými, vlnitými a vrstvenými vlasmi.' },
    { src: '/assets/papi-ig-2.jpg', alt: 'Detailný záber na vlasy s technikou balayage.' },
    { src: '/assets/papi-inspiration-rockstar.jpg', alt: 'Modelka s rebelským, strapatým rockovým účesom.' },
    { src: '/assets/papi-style-w-curtainbangs.jpg', alt: 'Žena s moderným účesom a ofinou typu "curtain bangs".' },
    { src: '/assets/papi-ig-4.jpg', alt: 'Modelka s dokonalou blond farbou a jemnými vlnami.' },
    { src: '/assets/papi-alterego-elf.jpg', alt: 'Modelka s dlhými, dokonale rovnými striebornými vlasmi v štýle elfa.' },
    { src: '/assets/papi-inspiration-cyberpunk.jpg', alt: 'Futuristický cyberpunkový účes s neónovými farbami.' },
    { src: '/assets/papi-alterego-romantic.jpg', alt: 'Žena s jemným, romantickým účesom s voľnými vlnami.' },
];

export const whatWeDoCards = [
    { id: 'styling', iconId: 'scissors' as const, titleId: 'card_styling_title', subtitleId: 'card_styling_subtitle' },
    { id: 'coloring', iconId: 'palette' as const, titleId: 'card_coloring_title', subtitleId: 'card_coloring_subtitle' },
    { id: 'updos', iconId: 'swirl' as const, titleId: 'card_updos_title', subtitleId: 'card_updos_subtitle' },
    { id: 'promo_2plus2', iconId: 'gift' as const, titleId: 'card_promo_2plus2_title', subtitleId: 'card_promo_2plus2_subtitle' },
    { id: 'booking', iconId: 'calendar' as const, titleId: 'card_booking_title', subtitleId: 'card_booking_subtitle' },
    { id: 'vto', iconId: 'wand' as const, titleId: 'card_virtual_try_on_title', subtitleId: 'card_virtual_try_on_subtitle' }
];

export const arHairColors = [
    { nameId: 'vto_ar_color_natural', value: [], relatedProductIds: [] },
    // Natural Shades
    { nameId: 'vto_ar_color_black', value: [0.1, 0.1, 0.1], relatedProductIds: [] },
    { nameId: 'vto_ar_color_brown', value: [0.3, 0.15, 0.05], relatedProductIds: ['conditioner'] },
    { nameId: 'vto_ar_color_ginger', value: [0.7, 0.3, 0.1], relatedProductIds: [] },
    { nameId: 'vto_ar_color_blonde', value: [0.9, 0.8, 0.6], relatedProductIds: ['shampoo'] },
    { nameId: 'vto_ar_color_platinum_blonde', value: [0.95, 0.95, 0.85], relatedProductIds: ['shampoo'] },
    // Vibrant Shades
    { nameId: 'vto_ar_color_red', value: [0.85, 0.1, 0.05], relatedProductIds: ['serum'] },
    { nameId: 'vto_ar_color_pink', value: [0.9, 0.5, 0.6], relatedProductIds: [] },
    { nameId: 'vto_ar_color_royal_purple', value: [0.5, 0.2, 0.8], relatedProductIds: [] },
    { nameId: 'vto_ar_color_emerald_green', value: [0.1, 0.6, 0.4], relatedProductIds: [] },
    { nameId: 'vto_ar_color_blue', value: [0.2, 0.4, 0.9], relatedProductIds: [] },
    { nameId: 'vto_ar_color_sunset_orange', value: [1.0, 0.4, 0.1], relatedProductIds: [] },
];

export const userVisitHistory: Visit[] = [
    {
        id: 'v1',
        date: '2024-06-15T14:00:00Z',
        stylistId: 'papi',
        serviceIds: ['mens_cut', 'beard_trim']
    },
    {
        id: 'v2',
        date: '2024-04-20T11:30:00Z',
        stylistId: 'julia',
        serviceIds: ['balayage_full']
    },
    {
        id: 'v3',
        date: '2024-02-10T16:00:00Z',
        stylistId: 'papi',
        serviceIds: ['mens_cut']
    },
];

export const userPurchaseHistory: Purchase[] = [
    {
        orderId: 'ORD123',
        date: '2024-06-15T15:00:00Z',
        items: [
            { productId: 'mousse', quantity: 1, price: 15.50 }
        ],
        total: 15.50
    },
    {
        orderId: 'ORD101',
        date: '2024-04-20T12:30:00Z',
        items: [
            { productId: 'shampoo', quantity: 1, price: 19.99 },
            { productId: 'conditioner', quantity: 1, price: 21.00 }
        ],
        total: 40.99
    }
];

export const userVipStatus = {
    levelId: 'profile_vip_level_gold',
    points: 1250,
    pointsToNextLevel: 750,
    memberSince: '2023-01-20T10:00:00Z'
};