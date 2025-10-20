// config/siteConfig.ts

export const siteConfig = {
  theme: {
    accentColor: '#D4AF37', // Tlmená zlatá
    fontSans: "'Inter', sans-serif",
  },
  hero: {
    backgroundUrl: '/assets/hero.webp', // Obnovené osvedčené pozadie
    cacheBustVersion: 'v=final-3.0', // Nová verzia pre cache busting
    titleId: 'heroTitle',
    subtitleId: 'heroSubtitle',
    button: {
      textId: 'heroButton',
    }
  },
  company: {
    name: 'PAPI HAIR DESIGN',
    descriptionId: 'footer_companyDescription',
    phone: '+421949459624',
    email: 'papihairdesign@gmail.com',
    address: 'Trieda SNP 61, Kosice, Slovakia',
    mapsUrl: 'https://www.google.com/maps/place/PAPI+Hair+Design/@48.7074223,21.2201857,14z',
  },
  socials: {
    instagram: 'https://www.instagram.com/papi_hair_design/',
    facebook: 'https://www.facebook.com/papihairdesign/',
  },
  links: {
      booking: 'https://services.bookio.com/papi-hair-design/widget?lang=sk',
  }
};