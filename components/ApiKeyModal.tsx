import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Icon } from './Icons';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (apiKey: string) => void;
    provider: 'OpenAI';
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, provider }) => {
    const { t } = useTranslation();
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = () => {
        if (apiKey.trim()) {
            onSave(apiKey.trim());
            setApiKey('');
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="content-pane w-full max-w-md animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    {/* Fix: The `t` function does not support interpolation. Use string.replace() to insert dynamic values. */}
<h2 className="text-2xl font-serif font-bold text-white">
                        {t('vto_api_key_modal_title').replace('{provider}', provider)}
                    </h2>
                     <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label={t('chat_close')}>
                        <Icon id="close" className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Fix: The `t` function does not support interpolation. Use string.replace() to insert dynamic values. */}
<p className="text-gray-400 mb-4">{t('vto_api_key_modal_desc').replace('{provider}', provider)}</p>

                <div className="space-y-4">
                    <input
                        type="password"
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        placeholder={t('vto_api_key_modal_placeholder')}
                        className="form-input"
                    />
                    {/* Fix: The `t` function does not support interpolation. Use string.replace() to insert dynamic values. */}
<a 
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-[var(--color-accent)] underline"
                    >
                        {t('vto_api_key_modal_link').replace('{provider}', provider)}
                    </a>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="btn-secondary">
                        <span>{t('vto_api_key_modal_cancel')}</span>
                    </button>
                    <button onClick={handleSubmit} className="btn-primary" disabled={!apiKey.trim()}>
                        <span>{t('vto_api_key_modal_save')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;