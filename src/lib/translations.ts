import { writable } from 'svelte/store';

export const translations = writable<any>({});

const dictionary: { [key: string]: any } = {
  sk: {
    about_us_title: 'O nás',
    about_us_header: 'Náš Tím',
    about_us_subheader: 'Ľudia, ktorí sa postarajú o vaše vlasy.',
    team: [
      {
        id: 'papi',
        name: 'Róbert "Papi" Papcun',
        title: 'Zakladateľ & Master Stylist',
        bio: 'Zakladateľ salónu s viac ako 15 rokmi skúseností v oblasti vlasového dizajnu. Špecializuje sa na prémiové služby a kreativné transformácie.',
        imageUrl: '/public/papi.png',
        services: ['Premium strihanie', 'Styling', 'Farba', 'Kreativné účesy']
      },
      {
        id: 'mato',
        name: 'Maťo',
        title: 'Professional Barber',
        bio: 'Špecialista na pánske strihy a úpravu brady s moderným prístupom. Majster klasických aj moderných techník strihánia.',
        imageUrl: '/public/mato.png',
        services: ['Pánske strihanie', 'Brada & fúzy', 'Klasické strihy', 'Fade techniques']
      },
      {
        id: 'miska',
        name: 'Miška',
        title: 'Creative Hair Artist',
        bio: 'Kreativita a moderné techniky sú jej silnou stránkou. Expertka na farebné transformácie a najnovšie trendy v kaderníctve.',
        imageUrl: '/public/miska.png',
        services: ['Dámske strihanie', 'Melír & farba', 'Styling', 'Moderné trendy']
      }
    ],
    whatWeDoTitle: 'Čo robíme',
    whatWeDoSubtitle: 'Naše Služby',
    card_styling_title: 'Strih & Styling',
    card_styling_subtitle: 'Moderné strihy pre dámy a pánov',
    card_coloring_title: 'Farbenie',
    card_coloring_subtitle: 'Kreatívne techniky farbenia',
    card_updos_title: 'Účesy',
    card_updos_subtitle: 'Spoločenské a svadobné účesy',
    card_booking_title: 'Rezervácie',
    card_booking_subtitle: 'Jednoduchý a rýchly online systém',
    whatWeDoCards: [
        { id: 'styling', iconId: 'scissors', titleId: 'card_styling_title', subtitleId: 'card_styling_subtitle' },
        { id: 'coloring', iconId: 'palette', titleId: 'card_coloring_title', subtitleId: 'card_coloring_subtitle' },
        { id: 'updos', iconId: 'swirl', titleId: 'card_updos_title', subtitleId: 'card_updos_subtitle' },
        { id: 'booking', iconId: 'calendar', titleId: 'card_booking_title', subtitleId: 'card_booking_subtitle' }
    ],
    womensServices: [
    {
        categoryId: "womens_cut_styling",
        services: [
            { id: "womens_cut", price: 35.00 },
            { id: "blowdry_long", price: 33.00 },
            { id: "blowdry_medium", price: 25.00 },
            { id: "final_styling", price: 20.00 },
        ],
    },
    {
        categoryId: "womens_coloring",
        services: [
            { id: "color_cut_roots", price: 65.00 },
            { id: "color_roots", price: 50.00 },
            { id: "color_full", price: 80.00 },
            { id: "color_cut_full", price: 100.00 },
        ],
    },
    {
        categoryId: "womens_balayage_highlights",
        services: [
            { id: "balayage_full", price: 160.00 },
            { id: "balayage_retouch", price: 130.00 },
            { id: "highlights_roots", price: 130.00 },
            { id: "highlights_full", price: 160.00 },
        ],
    },
    {
        categoryId: "womens_bleaching_regeneration",
        services: [
            { id: "toner_cleansing", price: 110.00 },
            { id: "color_stripping", price: 160.00 },
            { id: "methamorphyc_quick", price: 40.00 },
            { id: "methamorphyc_exclusive", price: 55.00 },
            { id: "brazilian_keratin", price: 150.00 },
        ],
    },
    {
        categoryId: "womens_extensions_updos",
        services: [
            { id: "tape_in_application", price: 45.00 },
            { id: "tape_in_reapplication", price: 140.00 },
            { id: "braids", price: 30.00 },
            { id: "formal_updo", price: 40.00 },
        ],
    },
],

mensServices: [
     {
        categoryId: "mens_hair",
        services: [
            { id: "junior_cut", price: 15.00 },
            { id: "mens_cut", price: 22.00 },
        ],
    },
    {
        categoryId: "mens_beard_combos",
        services: [
            { id: "beard_trim", price: 15.00 },
            { id: "hair_beard_combo", price: 32.00 },
            { id: "mens_special", price: 50.00 },
        ],
    },
    {
        categoryId: "mens_color",
        services: [
            { id: "perm", price: 40.00 },
            { id: "hair_lightening", price: 40.00 },
            { id: "beard_coloring", price: 10.00 },
            { id: "grey_blending", price: 10.00 },
        ],
    },
    {
        categoryId: "mens_addons",
        services: [
            { id: "nose_waxing", price: 5.00 },
            { id: "ear_waxing", price: 5.00 },
            { id: "ear_candles", price: 10.00 },
            { id: "peel_black_mask", price: 10.00 },
        ],
    }
],

serviceDetails: [
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
],
userVisitHistory: [
    { id: 1, date: '2024-06-20', serviceIds: ['womens_cut', 'blowdry_long'], stylistId: 'miska' },
    { id: 2, date: '2024-03-15', serviceIds: ['balayage_full'], stylistId: 'papi' },
    { id: 3, date: '2023-12-10', serviceIds: ['mens_cut', 'beard_trim'], stylistId: 'mato' },
],
userPurchaseHistory: [
    { orderId: 'XYZ123', date: '2024-06-20', items: [{ productId: 'prod1', quantity: 2, price: 25.00 }], total: 50.00 },
    { orderId: 'ABC789', date: '2024-03-15', items: [{ productId: 'prod2', quantity: 1, price: 45.00 }], total: 45.00 },
],
userVipStatus: {
    levelId: 'vip_gold',
    points: 1250,
    pointsToNextLevel: 750,
    memberSince: '2022-01-15',
}
  },
  en: {
    about_us_title: 'About Us',
    about_us_header: 'Our Team',
    about_us_subheader: 'The people who will take care of your hair.',
    team: [
      {
        id: 'papi',
        name: 'Róbert "Papi" Papcun',
        title: 'Founder & Master Stylist',
        bio: 'Founder of the salon with more than 15 years of experience in hair design. He specializes in premium services and creative transformations.',
        imageUrl: '/public/papi.png',
        services: ['Premium cuts', 'Styling', 'Color', 'Creative hairstyles']
      },
      {
        id: 'mato',
        name: 'Maťo',
        title: 'Professional Barber',
        bio: 'Specialist in men\'s cuts and beard grooming with a modern approach. Master of classic and modern cutting techniques.',
        imageUrl: '/public/mato.png',
        services: ['Men\'s cuts', 'Beard & mustache', 'Classic cuts', 'Fade techniques']
      },
      {
        id: 'miska',
        name: 'Miška',
        title: 'Creative Hair Artist',
        bio: 'Creativity and modern techniques are her strong suit. Expert in color transformations and the latest trends in hairdressing.',
        imageUrl: '/public/miska.png',
        services: ['Women\'s cuts', 'Highlights & color', 'Styling', 'Modern trends']
      }
    ],
    whatWeDoTitle: 'What We Do',
    whatWeDoSubtitle: 'Our Services',
    card_styling_title: 'Cut & Styling',
    card_styling_subtitle: 'Modern cuts for ladies and gentlemen',
    card_coloring_title: 'Coloring',
    card_coloring_subtitle: 'Creative coloring techniques',
    card_updos_title: 'Updos',
    card_updos_subtitle: 'Formal and wedding hairstyles',
    card_booking_title: 'Booking',
    card_booking_subtitle: 'Simple and fast online system',
    whatWeDoCards: [
        { id: 'styling', iconId: 'scissors', titleId: 'card_styling_title', subtitleId: 'card_styling_subtitle' },
        { id: 'coloring', iconId: 'palette', titleId: 'card_coloring_title', subtitleId: 'card_coloring_subtitle' },
        { id: 'updos', iconId: 'swirl', titleId: 'card_updos_title', subtitleId: 'card_updos_subtitle' },
        { id: 'booking', iconId: 'calendar', titleId: 'card_booking_title', subtitleId: 'card_booking_subtitle' }
    ]
  }
};

translations.set(dictionary['sk']);

export function setLanguage(lang: 'sk' | 'en') {
  if (dictionary[lang]) {
    translations.set(dictionary[lang]);
  }
}
