import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { NavigationIntent } from '../App';
import SectionHeader from './SectionHeader';
import { Icon } from './Icons';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../context/AuthContext';
import { useSavedLooks } from '../context/SavedLooksContext';
import { editImageWithGemini } from '../services/geminiService';
import { editImageWithDallE } from '../services/openaiService';
import { useChat } from '../context/ChatContext';
import VtoControlPanel from './VtoControlPanel';
import ARHairTryOn from './ARHairTryOn';
import ApiKeyModal from './ApiKeyModal';


declare const faceapi: any;

// Fix: The AIStudio interface and global Window augmentation were moved to `types.ts`
// to create a single source of truth for this global type. This resolves the
// "Subsequent property declarations must have the same type" error which occurs
// when a global type is declared in multiple module scopes.

interface VirtualTryOnProps {
    onNavigate: (intent: NavigationIntent) => void;
}

type FaceDetectorStatus = 'loading' | 'ready' | 'checking' | 'error';
type VtoMode = 'aiEdit' | 'arColor';
type ApiProvider = 'gemini' | 'openai';
type ApiKeyStatus = 'unknown' | 'checking' | 'selected' | 'required';

const OPENAI_API_KEY_STORAGE = 'papi_openai_api_key';

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();
    const { addNotification } = useNotification();
    const { isAuthenticated } = useAuth();
    const { savedLooks, saveLook, removeLook } = useSavedLooks();
    const { userImageForTryOn, setUserImageForTryOn, userImageMimeType, setUserImageMimeType, stylePromptForTryOn, setStylePromptForTryOn } = useChat();

    const [vtoMode, setVtoMode] = useState<VtoMode>('aiEdit');
    const [selectedApi, setSelectedApi] = useState<ApiProvider>('gemini');
    
    // Gemini state
    const [geminiApiKeyStatus, setGeminiApiKeyStatus] = useState<ApiKeyStatus>('checking');
    
    // OpenAI state
    const [openaiApiKey, setOpenaiApiKey] = useState('');
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [sourceImageType, setSourceImageType] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [faceDetectorStatus, setFaceDetectorStatus] = useState<FaceDetectorStatus>('loading');
    const [lastPrompt, setLastPrompt] = useState<string | null>(null);

    // Load OpenAI API key from session storage on mount
    useEffect(() => {
        const storedKey = sessionStorage.getItem(OPENAI_API_KEY_STORAGE);
        if (storedKey) {
            setOpenaiApiKey(storedKey);
        }
    }, []);

    const checkGeminiApiKey = useCallback(async () => {
        setGeminiApiKeyStatus('checking');
        if (window.aistudio && (await window.aistudio.hasSelectedApiKey())) {
            setGeminiApiKeyStatus('selected');
        } else {
            setGeminiApiKeyStatus('required');
        }
    }, []);

    useEffect(() => {
        if (vtoMode === 'aiEdit' && selectedApi === 'gemini') {
            checkGeminiApiKey();
        }
    }, [vtoMode, selectedApi, checkGeminiApiKey]);

    const handleGenerate = useCallback(async (finalPrompt: string) => {
        if (!sourceImage || !finalPrompt) {
            addNotification({ type: 'error', title: t('vto_error_title'), message: t('vto_error_no_image_prompt') });
            return;
        }

        if (selectedApi === 'openai' && !openaiApiKey) {
            setIsApiKeyModalOpen(true);
            return;
        }

        setLastPrompt(finalPrompt);
        setIsLoading(true);
        setGeneratedImage(null);

        const base64Data = sourceImage.split(',')[1];
        let result: { data: string | null; error: string | null };

        if (selectedApi === 'gemini') {
            result = await editImageWithGemini(base64Data, sourceImageType!, finalPrompt);
        } else { // openai
            result = await editImageWithDallE(sourceImage, finalPrompt, openaiApiKey);
        }
        
        if (result.data) {
            setGeneratedImage(`data:image/jpeg;base64,${result.data}`);
            addNotification({ type: 'success', title: t('vto_success_title'), message: t('vto_success_message') });
        } else {
            addNotification({ type: 'error', title: t('vto_error_title'), message: t(result.error || 'api_unexpectedError') });
            if (result.error === 'vto_error_quota' || result.error === 'vto_error_bad_key') {
                setGeminiApiKeyStatus('required');
            }
            if (result.error === 'vto_error_bad_openai_key') {
                setOpenaiApiKey('');
                sessionStorage.removeItem(OPENAI_API_KEY_STORAGE);
                setIsApiKeyModalOpen(true);
            }
        }

        setIsLoading(false);
    }, [sourceImage, sourceImageType, addNotification, t, selectedApi, openaiApiKey]);
    
    useEffect(() => {
        const loadModels = async () => {
            if (typeof faceapi === 'undefined') {
                setTimeout(loadModels, 100); return;
            }
            try {
                const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
                await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
                setFaceDetectorStatus('ready');
            } catch (error) {
                console.error('Error loading face-api models:', error);
                setFaceDetectorStatus('error');
            }
        };
        loadModels();
    }, []);

    useEffect(() => {
        const canGenerate = (selectedApi === 'gemini' && geminiApiKeyStatus === 'selected') || (selectedApi === 'openai' && !!openaiApiKey);
        if (userImageForTryOn && stylePromptForTryOn && userImageMimeType) {
            setVtoMode('aiEdit');
            setSourceImage(userImageForTryOn);
            setSourceImageType(userImageMimeType);
            if (canGenerate) {
                handleGenerate(stylePromptForTryOn);
            }
            setUserImageForTryOn(null); setUserImageMimeType(null); setStylePromptForTryOn(null);
        }
    }, [userImageForTryOn, stylePromptForTryOn, userImageMimeType, handleGenerate, setUserImageForTryOn, setUserImageMimeType, setStylePromptForTryOn, geminiApiKeyStatus, selectedApi, openaiApiKey]);

    const processFile = useCallback(async (file: File) => {
        if (!file || !file.type.startsWith('image/')) {
            addNotification({ type: 'error', title: t('vto_error_title'), message: t('vto_error_invalid_file_type') });
            return;
        }
        if (faceDetectorStatus !== 'ready') return;

        setSourceImage(URL.createObjectURL(file));
        setGeneratedImage(null);
        setLastPrompt(null);
        setFaceDetectorStatus('checking');

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
            try {
                const detections = await faceapi.detectAllFaces(img, new faceapi.SsdMobilenetv1Options());
                if (detections.length > 0) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setSourceImage(e.target?.result as string);
                        setSourceImageType(file.type);
                    };
                    reader.readAsDataURL(file);
                } else {
                    addNotification({ type: 'warning', title: t('vto_face_not_detected_title'), message: t('vto_face_not_detected_message') });
                    setSourceImage(null);
                }
            } catch (error) {
                console.error('Face detection error:', error);
                setSourceImage(null);
            } finally {
                setFaceDetectorStatus('ready');
                URL.revokeObjectURL(img.src);
            }
        };
    }, [faceDetectorStatus, addNotification, t]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) processFile(e.target.files[0]);
    };
    const handleDragEvents = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: React.DragEvent) => {
        handleDragEvents(e);
        setIsDraggingOver(false);
        if (faceDetectorStatus === 'ready' && e.dataTransfer.files?.[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleSaveLook = () => {
        if (generatedImage) {
            saveLook(generatedImage);
            addNotification({type: 'success', title: t('vto_lookSaved_title'), message: t('vto_lookSaved_message')});
        }
    };
    
    const handleRemoveImage = () => {
        setSourceImage(null);
        setSourceImageType(null);
        setGeneratedImage(null);
        setLastPrompt(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSelectGeminiApiKey = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            setGeminiApiKeyStatus('selected');
        }
    };

    const handleSaveOpenAiKey = (key: string) => {
        setOpenaiApiKey(key);
        sessionStorage.setItem(OPENAI_API_KEY_STORAGE, key);
        setIsApiKeyModalOpen(false);
    };

    const renderApiKeyPrompt = () => {
        if (selectedApi === 'gemini' && geminiApiKeyStatus === 'required') {
             return (
                <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                    <Icon id="wand" className="w-16 h-16 text-[var(--color-accent)] mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">{t('vto_api_key_required_title')}</h3>
                    <p className="text-gray-400 mb-6 max-w-sm">{t('vto_api_key_required_desc')}</p>
                    <div className="flex flex-col items-center gap-4">
                        <button onClick={handleSelectGeminiApiKey} className="btn-primary">
                            <span>{t('vto_api_key_select_button')}</span>
                        </button>
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-[var(--color-accent)] underline">
                            {t('vto_api_key_billing_link')}
                        </a>
                    </div>
                </div>
            );
        }
        if (selectedApi === 'openai' && !openaiApiKey) {
            return (
                 <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                    <Icon id="wand" className="w-16 h-16 text-[var(--color-accent)] mb-4" />
                    {/* Fix: The `t` function does not support interpolation. Use string.replace() to insert dynamic values. */}
<h3 className="text-2xl font-bold text-white mb-2">{t('vto_api_key_modal_title').replace('{provider}', 'OpenAI')}</h3>
                    <p className="text-gray-400 mb-6 max-w-sm">{t('vto_api_key_required_openai_desc')}</p>
                    <button onClick={() => setIsApiKeyModalOpen(true)} className="btn-primary">
                        <span>{t('vto_api_key_enter_button')}</span>
                    </button>
                </div>
            );
        }
        return null;
    }

    const renderAiEdit = () => {
        const apiKeyPrompt = renderApiKeyPrompt();
        if (apiKeyPrompt) return apiKeyPrompt;

        const uploaderStateText = faceDetectorStatus === 'loading' ? t('vto_face_api_loading_models') : t('vto_upload_cta');

        return (
         <>
            {!sourceImage ? (
                <div className="min-h-[400px] flex items-center justify-center" onDrop={handleDrop} onDragOver={handleDragEvents} onDragEnter={() => setIsDraggingOver(true)} onDragLeave={() => setIsDraggingOver(false)}>
                    <div className={`vto-upload-placeholder w-full h-full border-2 border-dashed rounded-lg ${isDraggingOver ? 'border-[var(--color-accent)] bg-[rgba(212,175,55,0.1)]' : 'border-[var(--color-border-primary)]'}`} onClick={() => faceDetectorStatus === 'ready' && fileInputRef.current?.click()}>
                        <Icon id={faceDetectorStatus === 'loading' ? 'loader' : 'camera'} className={`w-16 h-16 text-gray-500 mb-4 ${faceDetectorStatus === 'loading' ? 'animate-spin' : ''}`} />
                        <p className="font-bold text-white text-xl">{uploaderStateText}</p>
                        <p className="text-sm text-gray-400">{t('vto_upload_subtext')}</p>
                        <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleFileChange} className="hidden" disabled={faceDetectorStatus !== 'ready'} />
                    </div>
                </div>
            ) : (
                <div className="vto-wrapper animate-fade-in-up">
                    <div className="vto-main-panel">
                        <div className="vto-image-container">
                            <h3 className="vto-image-header">{t('vto_source_image_title')}</h3>
                            <div className="vto-image-box"><img src={sourceImage} alt={t('vto_source_image_alt')} /></div>
                        </div>
                        <div className="vto-image-container">
                            <h3 className="vto-image-header">{t('vto_generated_image_title')}</h3>
                            <div className={`vto-image-box ${isLoading ? 'loading' : ''}`}>
                                {isLoading && <div className="vto-loader"><div className="spinner"></div></div>}
                                {generatedImage && !isLoading && <img src={generatedImage} alt={t('vto_generated_image_alt')} />}
                                {!generatedImage && !isLoading && <Icon id="sparkles" className="w-12 h-12 text-gray-500" />}
                            </div>
                        </div>
                        <div className="md:col-span-2 vto-actions">
                            <button onClick={() => fileInputRef.current?.click()} className="vto-action-btn" disabled={isLoading}><Icon id="refresh" className="w-5 h-5"/>{t('vto_button_changePhoto')}</button>
                            {lastPrompt && <button onClick={() => handleGenerate(lastPrompt)} className="vto-action-btn" disabled={isLoading}><Icon id="sparkles" className="w-5 h-5"/>{t('vto_button_tryAgain')}</button>}
                            {isAuthenticated && generatedImage && <button onClick={handleSaveLook} className="vto-action-btn" disabled={isLoading}><Icon id="heart" className="w-5 h-5"/>{t('vto_button_saveLook')}</button>}
                            <button onClick={handleRemoveImage} className="vto-action-btn" disabled={isLoading}><Icon id="trash-2" className="w-5 h-5"/>{t('vto_button_removePhoto')}</button>
                        </div>

                        {isAuthenticated && savedLooks.length > 0 && (
                            <div className="md:col-span-2 mt-8 animate-fade-in-up">
                                <h4 className="text-xl font-bold text-white mb-4 text-center">{t('vto_my_looks_title')}</h4>
                                <div className="saved-looks-grid pr-2" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', maxHeight: '260px', overflowY: 'auto' }}>
                                    {savedLooks.map((look, index) => (
                                        <div key={index} className="saved-look-card group">
                                            <img src={look} alt={`${t('profile_looks_savedLook')} ${index + 1}`} loading="lazy" />
                                            <div className="saved-look-overlay !bg-black/60 flex items-center justify-center gap-4">
                                                <button onClick={() => setGeneratedImage(look)} className="text-white hover:text-[var(--color-accent)] transition-colors p-2 bg-black/40 rounded-full backdrop-blur-sm" aria-label={t('vto_view_look')}><Icon id="eye" className="w-6 h-6" /></button>
                                                <button onClick={() => removeLook(look)} className="text-white hover:text-red-500 transition-colors p-2 bg-black/40 rounded-full backdrop-blur-sm" aria-label={t('profile_looks_remove')}><Icon id="trash-2" className="w-6 h-6" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <VtoControlPanel onGenerate={handleGenerate} isLoading={isLoading} sourceImageExists={!!sourceImage} />
                </div>
            )}
        </>
    );
    }

    return (
        <>
            <section ref={ref} id="virtual-try-on" className={`min-h-screen flex flex-col items-center justify-center py-20 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader title={t('vto_title')} subtitle={t('vto_subtitle')} />
                    <div className="vto-container-redesigned">
                        <div className="vto-mode-switcher">
                            <button onClick={() => setVtoMode('aiEdit')} className={`vto-mode-btn ${vtoMode === 'aiEdit' ? 'active' : ''}`} aria-current={vtoMode === 'aiEdit'}>{t('vto_tab_ai_edit')}</button>
                            <button onClick={() => setVtoMode('arColor')} className={`vto-mode-btn ${vtoMode === 'arColor' ? 'active' : ''}`} aria-current={vtoMode === 'arColor'}>{t('vto_tab_ar_color')}</button>
                        </div>
                        
                        {vtoMode === 'aiEdit' && (
                            <div className="mb-6">
                                <div className="vto-mode-switcher !max-w-xs mx-auto">
                                    <button onClick={() => setSelectedApi('gemini')} className={`vto-mode-btn ${selectedApi === 'gemini' ? 'active' : ''}`}>Gemini</button>
                                    <button onClick={() => setSelectedApi('openai')} className={`vto-mode-btn ${selectedApi === 'openai' ? 'active' : ''}`}>OpenAI</button>
                                </div>
                            </div>
                        )}

                        {vtoMode === 'aiEdit' ? renderAiEdit() : <ARHairTryOn />}
                    </div>
                </div>
            </section>
            <ApiKeyModal
                isOpen={isApiKeyModalOpen}
                onClose={() => setIsApiKeyModalOpen(false)}
                onSave={handleSaveOpenAiKey}
                provider="OpenAI"
            />
        </>
    );
};

export default VirtualTryOn;