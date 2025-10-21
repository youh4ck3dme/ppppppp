
import { writable } from 'svelte/store';

export const translations = writable<any>({});

const dictionary: { [key: string]: any } = {
  sk: {
    // ... (other translations)
    about_us_title: 'O nás',
    about_us_header: 'Náš Tím',
    about_us_subheader: 'Ľudia, ktorí sa postarajú o vaše vlasy.',

    team: {
      founder: {
        name: 'Róbert "Papi" Papcun',
        title: 'Zakladateľ & Master Stylist',
        bio: 'S viac ako desaťročnou praxou a vášňou pre vlasový dizajn, Papi vedie náš salón s víziou spojiť umenie s remeslom. Jeho prístup je založený na neustálom vzdelávaní, sledovaní svetových trendov a budovaní silných vzťahov s klientmi. V Papi Hair Design nejde len o strihanie vlasov – ide o vytváranie zážitku.',
        imageUrl: '/images/team/papi.jpg' // Example path
      },
      members: [
        {
          name: 'Júlia Kováčová',
          title: 'Senior Stylist',
          bio: 'Júlia je expertkou na farbenie a zložité techniky. Jej kreativita a precíznosť zaručujú, že každý klient odchádza s úsmevom.',
          imageUrl: '/images/team/julia.jpg' // Example path
        },
        {
          name: 'Martin Novák',
          title: 'Barber & Stylist',
          bio: 'Martin sa špecializuje na pánske strihy a úpravu brady. S citom pre detail a moderné trendy vytvorí dokonalý look pre každého muža.',
          imageUrl: '' // Intentionally left blank to test placeholder
        }
      ]
    }
  },
  en: {
    // ... (other translations)
    about_us_title: 'About Us',
    about_us_header: 'Our Team',
    about_us_subheader: 'The people who will take care of your hair.',

    team: {
      founder: {
        name: 'Róbert "Papi" Papcun',
        title: 'Founder & Master Stylist',
        bio: 'With more than a decade of experience and a passion for hair design, Papi leads our salon with a vision to merge art with craft. His approach is based on continuous education, following global trends, and building strong relationships with clients. At Papi Hair Design, it is not just about cutting hair – it is about creating an experience.',
        imageUrl: '/images/team/papi.jpg' // Example path
      },
      members: [
        {
          name: 'Júlia Kováčová',
          title: 'Senior Stylist',
          bio: 'Júlia is an expert in coloring and complex techniques. Her creativity and precision ensure that every client leaves with a smile.',
          imageUrl: '/images/team/julia.jpg' // Example path
        },
        {
          name: 'Martin Novák',
          title: 'Barber & Stylist',
          bio: 'Martin specializes in men\'s cuts and beard grooming. With an eye for detail and modern trends, he will create the perfect look for any man.',
          imageUrl: '' // Intentionally left blank to test placeholder
        }
      ]
    }
  }
};

// Initialize with default language
translations.set(dictionary['sk']);

export function setLanguage(lang: 'sk' | 'en') {
  if (dictionary[lang]) {
    translations.set(dictionary[lang]);
  }
}
