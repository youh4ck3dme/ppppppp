import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { inspirationPromptsData, alterEgoPromptsData, sosScenariosData, hairchangerStyles } from '../constants';
import { Icon } from './Icons';
import Accordion from './Accordion';

interface VtoControlPanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  sourceImageExists: boolean;
}

const VtoControlPanel: React.FC<VtoControlPanelProps> = ({ onGenerate, isLoading, sourceImageExists }) => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');

  const creativePrompts = [...inspirationPromptsData, ...alterEgoPromptsData];

  return (
    <div className="vto-controls-panel">
      <div className="space-y-2">
        <Accordion title={t('vto_tab_hairchanger')} defaultOpen>
          <div className="vto-grid">
            {hairchangerStyles.map(s => (
              <button
                key={s.id}
                className="vto-grid-item--animated group"
                onClick={() => onGenerate(s.name)}
                disabled={!sourceImageExists || isLoading}
                aria-label={s.name}
              >
                <div
                  className="vto-animated-bg"
                  style={{ backgroundImage: `url(${s.image})` }}
                  aria-hidden="true"
                ></div>
                <div className="vto-animated-content">
                  <Icon id="wand" className="w-6 h-6 text-gray-200 group-hover:text-[var(--color-accent)] transition-colors duration-300" />
                  <span>{s.name}</span>
                </div>
              </button>
            ))}
          </div>
        </Accordion>

        <Accordion title={t('vto_tab_inspiration')}>
           <div className="vto-grid">
            {creativePrompts.map(p => (
              <button
                key={p.id}
                className="vto-grid-item--animated group"
                onClick={() => onGenerate(t(p.promptId))}
                disabled={!sourceImageExists || isLoading}
                aria-label={t(p.titleId)}
              >
                <div
                  className="vto-animated-bg"
                  style={{ backgroundImage: `url(${p.image})` }}
                  aria-hidden="true"
                ></div>
                 <div className="vto-animated-content">
                    <span>{t(p.titleId)}</span>
                </div>
              </button>
            ))}
          </div>
        </Accordion>
        
        <Accordion title={t('vto_tab_sos')}>
          <div className="vto-grid">
            {sosScenariosData.map(p => (
              <button
                key={p.id}
                className="vto-grid-item-sos"
                onClick={() => onGenerate(t(p.promptId))}
                disabled={!sourceImageExists || isLoading}
              >
                <Icon id={p.iconId} className="w-8 h-8" />
                <span>{t(p.titleId)}</span>
              </button>
            ))}
          </div>
        </Accordion>

        <Accordion title={t('vto_tab_freeform')}>
            <div className="flex gap-2">
                <label htmlFor="vto-freeform-prompt" className="sr-only">{t('vto_freeform_placeholder')}</label>
                <input
                    id="vto-freeform-prompt"
                    name="prompt"
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('vto_freeform_placeholder')}
                    className="vto-input"
                />
                <button
                    onClick={() => onGenerate(prompt)}
                    className="btn-primary"
                    disabled={!sourceImageExists || isLoading || !prompt}
                    aria-label={t('vto_freeform_button')}
                >
                    <span className="!px-4">
                        <Icon id="send" className="w-5 h-5"/>
                    </span>
                </button>
            </div>
        </Accordion>
      </div>
    </div>
  );
};

export default VtoControlPanel;