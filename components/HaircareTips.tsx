import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define TypeScript types
type TipCategory = 'starostlivost' | 'ochrana' | 'styling' | 'zdravie' | 'celorocne';
type FilterCategory = 'Všetko' | 'Starostlivosť' | 'Ochrana' | 'Styling' | 'Zdravie';

interface HaircareTip {
  title: string;
  description: string;
  categories: TipCategory[];
}

// Data as specified in the prompt
const haircareTips: HaircareTip[] = [
  {
    title: 'HYDRATÁCIA JE ZÁKLAD',
    description: 'Správna starostlivosť začína hydratáciou, ktorá posilňuje, vyživuje a dodáva vlasom prirodzený lesk a jemnosť. Doprajte svojim vlasom luxus, ktorý si zaslúžia.',
    categories: ['starostlivost', 'celorocne'],
  },
  {
    title: 'TERMÁLNA OCHRANA / OCHRANA PRED UV',
    description: 'Okamžitá ochrana vlasov pred teplom, pre zdravé, lesklé a jemné vlasy. Vždy používajte tepelnú ochranu pred sušením a žehlením vlasov. Chráňte svoje vlasy pred slnkom pomocou špeciálnych sprejov s UV filtrom.',
    categories: ['ochrana', 'celorocne'],
  },
  {
    title: 'ZDRAVÁ POKOŽKA HLAVY',
    description: 'Zdravá pokožka je základ krásnych vlasov. Správna starostlivosť upokojuje, vyživuje a chráni pokožku hlavy, podporuje rast vlasov a zachováva ich prirodzenú rovnováhu.',
    categories: ['zdravie', 'celorocne'],
  },
  {
    title: 'LESK A ŽIARIVOSŤ',
    description: 'Objavte tajomstvo zdravých, žiarivých vlasov. Naše produkty Gold Professional Haircare Vám zabezpečia hĺbkovú výživu, obnovu a prirodzený lesk vašich vlasov od korienkov až po končeky.',
    categories: ['styling', 'celorocne'],
  },
  {
    title: 'BLOND V DOKONALOSTI',
    description: 'Jasné, lesklé a živé blond odtiene. Starostlivosť, ktorá zachováva farbu, chráni pred žltnutím a dodáva vlasom hodvábnu jemnosť.',
    categories: ['starostlivost', 'celorocne'],
  },
];

const filterCategories: FilterCategory[] = ['Všetko', 'Starostlivosť', 'Ochrana', 'Styling', 'Zdravie'];

// Mapping from display name to internal category name
const categoryMap: { [key in FilterCategory]: TipCategory | 'vsetko' } = {
    'Všetko': 'vsetko',
    'Starostlivosť': 'starostlivost',
    'Ochrana': 'ochrana',
    'Styling': 'styling',
    'Zdravie': 'zdravie',
};

const HaircareTips: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<FilterCategory>('Všetko');

    const filteredTips = useMemo(() => {
        if (activeFilter === 'Všetko') {
            return haircareTips;
        }
        const filterKey = categoryMap[activeFilter];
        return haircareTips.filter(tip => tip.categories.includes(filterKey as TipCategory));
    }, [activeFilter]);
    
    const sectionVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
            },
        },
        exit: {
            y: -20,
            opacity: 0,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <motion.section 
            className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
        >
            <div className="container mx-auto">
                <motion.h2 
                    className="text-4xl md:text-5xl font-serif font-bold text-center text-white mb-4"
                    variants={itemVariants}
                >
                    HAIRCARE & TIPS
                </motion.h2>
                <motion.p 
                    className="text-lg md:text-xl text-gray-400 text-center mb-12"
                    variants={itemVariants}
                >
                    Profesionálne produkty a starostlivosť pre dokonalé vlasy
                </motion.p>

                <motion.div 
                    className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12"
                    variants={itemVariants}
                >
                    {filterCategories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveFilter(category)}
                            className={`relative px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[var(--color-accent)] ${
                                activeFilter === category ? 'text-black' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            {activeFilter === category && (
                                <motion.div
                                    layoutId="active-filter-pill"
                                    className="absolute inset-0 bg-[var(--color-accent)] rounded-full"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{category}</span>
                        </button>
                    ))}
                </motion.div>

                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={sectionVariants}
                >
                    <AnimatePresence mode="popLayout">
                        {filteredTips.map((tip) => (
                            <motion.div
                                key={tip.title}
                                layout
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                whileHover={{ 
                                    y: -8,
                                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)',
                                    borderColor: 'rgba(212, 175, 55, 0.5)'
                                }}
                                className="bg-black/20 backdrop-blur-lg border border-gray-800 rounded-xl p-6 flex flex-col h-full"
                            >
                                <h3 className="text-xl font-bold text-white mb-3">{tip.title}</h3>
                                <p className="text-gray-400 flex-grow mb-4 leading-relaxed">{tip.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {tip.categories.map(cat => (
                                       cat !== 'celorocne' && <span key={cat} className="text-xs font-semibold text-black bg-[var(--color-accent)]/80 px-2 py-1 rounded-full">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default HaircareTips;