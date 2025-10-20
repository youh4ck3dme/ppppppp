import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { NavigationIntent } from '../App';
import { siteConfig } from '../config/siteConfig';
import { useNotification } from '../hooks/useNotification';
import SectionHeader from './SectionHeader';
import { Icon } from './Icons';

// --- PROMPT FOR THIS COMPONENT ---
// Create a React functional component named "Contact" for a high-end hair salon website.
//
// **Requirements:**
// 1.  **Styling:** Use Tailwind CSS classes consistent with the existing project's dark, luxurious theme (`content-pane`, `form-input`, `btn-primary`, etc.).
// 2.  **Layout:**
//     -   Use the `SectionHeader` component for the title ("Kontakt") and a suitable subtitle.
//     -   The main content should be within a `content-pane`.
//     -   Use a responsive grid (md:grid-cols-2) for the main content area.
//     -   **Left Column (Contact Details):**
//         -   Display Address, Phone, and Email using data from `siteConfig`.
//         -   Include a section for "Otváracie Hodiny" (Opening Hours) with Mon-Fri, 9:00 - 18:00.
//         -   Use icons (`map-pin`, `phone`, `mail`) next to each piece of contact information.
//     -   **Right Column (Contact Form):**
//         -   A simple form with fields for "Meno" (Name), "Email", and "Správa" (Message).
//         -   A "Odoslať správu" (Send Message) submit button using `btn-primary` style.
//         -   The form should have a simulated submit handler that shows a success notification using `useNotification`.
//     -   **Map:** Below the grid, embed a Google Map using an `iframe`. The map URL is available in `siteConfig.company.mapsUrl`. The map should be full-width, responsive, and have a dark theme filter (`filter: grayscale(1) invert(1)`).
// 3.  **Functionality:**
//     -   Use the `useTranslation` hook for all text.
//     -   Use the `useNotification` hook for form submission feedback.
//     -   The component should accept an `onNavigate` prop of type `(intent: NavigationIntent) => void`.
// 4.  **Accessibility:**
//     -   Use appropriate labels for form inputs (`htmlFor`, `aria-label`, etc.).
// --- END PROMPT ---


interface ContactProps {
    onNavigate: (intent: NavigationIntent) => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !/^\S+@\S+\.\S+$/.test(formData.email) || !formData.message) {
            addNotification({ type: 'error', title: t('contact_notification_error_title'), message: t('contact_notification_error_message') });
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setFormData({ name: '', email: '', message: '' });
            addNotification({ type: 'success', title: t('contact_notification_success_title'), message: t('contact_notification_success_message') });
        }, 1500);
    };

    const contactDetails = [
        { icon: 'map-pin', text: siteConfig.company.address, href: siteConfig.company.mapsUrl },
        { icon: 'phone', text: siteConfig.company.phone, href: `tel:${siteConfig.company.phone}` },
        { icon: 'mail', text: siteConfig.company.email, href: `mailto:${siteConfig.company.email}` },
    ];

    return (
        <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto animate-fade-in-up">
                <SectionHeader title={t('contact_title')} subtitle={t('contact_subtitle')} />
                <div className="content-pane !p-8 md:!p-12">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Left Column: Contact Details */}
                        <div className="space-y-8">
                            <div>
                                {contactDetails.map(detail => (
                                    <div key={detail.icon} className="flex items-start gap-4 mb-4">
                                        <Icon id={detail.icon as any} className="w-6 h-6 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                                        <a href={detail.href} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-lg">
                                            {detail.text}
                                        </a>
                                    </div>
                                ))}
                            </div>
                             <div>
                                <h3 className="text-2xl font-serif font-bold text-white mb-4">{t('contact_opening_hours')}</h3>
                                <div className="flex items-start gap-4">
                                     <Icon id="calendar" className="w-6 h-6 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                                     <div className="text-gray-300 text-lg">
                                        <p>{t('contact_hours_mf')}: 9:00 - 18:00</p>
                                        <p>Sobota - Nedeľa: Zatvorené</p>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Contact Form */}
                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder={t('contact_form_name')} className="form-input" required aria-label={t('contact_form_name')} />
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t('contact_form_email')} className="form-input" required aria-label={t('contact_form_email')} />
                            <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder={t('contact_form_message')} rows={5} className="form-input !rounded-xl" required aria-label={t('contact_form_message')}></textarea>
                            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                                {isSubmitting ? <Icon id="loader" className="w-6 h-6 animate-spin mx-auto" /> : t('contact_form_send')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-16 rounded-lg overflow-hidden shadow-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2647.519183416625!2d21.23632531565928!3d48.71180397927368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473ee0f5b1e7c4f1%3A0x6b4a3a66914620f5!2sTrieda%20SNP%2061%2C%20040%2011%20Ko%C5%A1ice!5e0!3m2!1sen!2ssk!4v1620000000000"
                        width="100%"
                        height="450"
                        style={{ border: 0, filter: 'grayscale(1) invert(1)' }}
                        allowFullScreen={true}
                        loading="lazy"
                        title="Papi Hair Design Location"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Contact;
