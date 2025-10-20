import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { NavigationIntent } from '../App';
import { Icon } from './Icons';

interface OnboardingGuideProps {
    onNavigate: (intent: NavigationIntent) => void;
}

const STORAGE_KEY = 'papi_onboarding_completed_v1';

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const [isActive, setIsActive] = useState(false);
    const [step, setStep] = useState(0);

    const steps = [
        {
            targetId: 'virtual-try-on',
            title: t('onboarding_step1_title'),
            text: t('onboarding_step1_text'),
            position: 'top-start'
        },
        {
            targetId: 'featured-products',
            title: t('onboarding_step2_title'),
            text: t('onboarding_step2_text'),
            position: 'top-start'
        },
        {
            targetId: 'vip-club',
            title: t('onboarding_step3_title'),
            text: t('onboarding_step3_text'),
            position: 'top-start'
        }
    ];

    const startGuide = useCallback(() => {
        setIsActive(true);
        setStep(0);
    }, []);

    useEffect(() => {
        const hasCompleted = localStorage.getItem(STORAGE_KEY);
        const shouldStartFromProfile = sessionStorage.getItem('start_onboarding');

        if (shouldStartFromProfile) {
            sessionStorage.removeItem('start_onboarding');
            startGuide();
        } else if (!hasCompleted) {
            // Show after a small delay on first visit
            const timer = setTimeout(startGuide, 2000);
            return () => clearTimeout(timer);
        }
    }, [startGuide]);

    const finishGuide = () => {
        setIsActive(false);
        localStorage.setItem(STORAGE_KEY, 'true');
    };

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(s => s + 1);
        } else {
            finishGuide();
        }
    };

    const currentStep = steps[step];
    const targetElement = document.getElementById(currentStep?.targetId);

    useEffect(() => {
        if (isActive && targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [step, isActive, targetElement]);

    if (!isActive || !targetElement) return null;

    const rect = targetElement.getBoundingClientRect();
    const tooltipStyle = {
        top: `${window.scrollY + rect.bottom + 10}px`,
        left: `${rect.left}px`,
    };

    return (
        <div className="fixed inset-0 z-[200]">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={finishGuide}></div>
            
            {/* Highlight Box */}
            <div
                className="absolute transition-all duration-300 ease-in-out border-2 border-dashed border-[var(--color-accent)] rounded-lg shadow-2xl"
                style={{
                    top: `${window.scrollY + rect.top - 10}px`,
                    left: `${rect.left - 10}px`,
                    width: `${rect.width + 20}px`,
                    height: `${rect.height + 20}px`,
                    pointerEvents: 'none'
                }}
            ></div>
            
            {/* Tooltip */}
            <div
                className="absolute z-10 p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-full max-w-sm animate-fade-in-up"
                style={tooltipStyle}
                role="dialog"
                aria-labelledby="onboarding-title"
            >
                <h3 id="onboarding-title" className="text-xl font-bold text-white mb-2">{currentStep.title}</h3>
                <p className="text-gray-300 mb-4">{currentStep.text}</p>
                
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        {steps.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-[var(--color-accent)]' : 'bg-gray-600'}`}></div>
                        ))}
                    </div>
                    
                    <div className="flex gap-4">
                        <button onClick={finishGuide} className="text-gray-400 hover:text-white font-semibold text-sm">
                            {t('onboarding_skip')}
                        </button>
                        <button onClick={nextStep} className="bg-[var(--color-accent)] text-black font-bold px-4 py-2 rounded-full text-sm">
                            {step === steps.length - 1 ? t('onboarding_finish') : t('onboarding_next')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingGuide;