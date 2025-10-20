import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useTranslation } from '../hooks/useTranslation';
import { useNotification } from '../hooks/useNotification';
import { ChatAction, ChatMessage } from '../types';
import { Icon } from './Icons';
import { chatWithGemini } from '../services/geminiService';
import { NavigationIntent } from '../App';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

interface ChatAssistantProps {
    onNavigate: (intent: NavigationIntent) => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const { products } = useProducts();
    const { 
        isOpen, setIsOpen, messages, addMessage, updateLastMessage, 
        isLoading, setIsLoading, clearChat,
        setUserImageForTryOn, setUserImageMimeType, setStylePromptForTryOn
    } = useChat();
    const { addToCart } = useCart();
    const { addNotification } = useNotification();
    
    const [inputValue, setInputValue] = useState('');
    const [imagePreview, setImagePreview] = useState<{ data: string, mimeType: string } | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bubbleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const processImageFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                setImagePreview({ data: dataUrl, mimeType: file.type });
            };
            reader.readAsDataURL(file);
        } else if (file) {
            addNotification({ type: 'error', title: t('vto_error_title'), message: t('vto_error_invalid_file_type') });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processImageFile(file);
        }
        event.target.value = ''; // Allow re-uploading the same file
    };
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if ((!trimmedInput && !imagePreview) || isLoading) return;

        const userMessage: Omit<ChatMessage, 'id'> = { sender: 'user' };
        if (trimmedInput) userMessage.text = trimmedInput;
        if (imagePreview) userMessage.imageUrl = imagePreview.data;
        
        addMessage(userMessage);
        
        const textToSend = trimmedInput || (imagePreview ? t('chat_initial_photo_prompt') : '');

        setInputValue('');
        const imageToSend = imagePreview;
        setImagePreview(null);
        setIsLoading(true);
        addMessage({ sender: 'ai', isLoading: true });
        
        const history: ChatMessage[] = [...messages, {id: '', sender: 'user', text: textToSend, imageUrl: imageToSend?.data }];
        
        const base64Data = imageToSend?.data.split(',')[1];
        const result = await chatWithGemini(
            history,
            t,
            products,
            imageToSend ? { data: base64Data!, mimeType: imageToSend.mimeType } : undefined
        );

        if (result.text) {
            updateLastMessage({ text: result.text, actions: result.actions, isLoading: false });
        } else {
            updateLastMessage({ text: t(result.error || 'api_unexpectedError'), isLoading: false });
        }
        setIsLoading(false);
    };

    const handleActionClick = (action: ChatAction) => {
        if (action.type === 'book-appointment') {
            onNavigate({ view: 'booking' });
            setIsOpen(false);
        } else if (action.type === 'try-style' && action.payload?.stylePrompt) {
            const userImage = messages.find(m => m.sender === 'user' && m.imageUrl)?.imageUrl;
            if (userImage) {
                const mimeType = userImage.substring(userImage.indexOf(':') + 1, userImage.indexOf(';'));
                setUserImageForTryOn(userImage);
                setUserImageMimeType(mimeType);
                setStylePromptForTryOn(action.payload.stylePrompt);
                onNavigate({ view: 'main', sectionId: 'virtual-try-on' });
                setIsOpen(false);
            }
        } else if (action.type === 'view-product' && action.payload?.productId) {
            const product = products.find(p => p.id === action.payload?.productId);
            if (product) {
                addToCart(product);
                addNotification({
                    type: 'success',
                    title: t('notification_productAdded_title'),
                    message: t('notification_productRecommended_message').replace('{productName}', t(product.nameId)),
                });
            }
        }
    };
    
    const handleDragEvents = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent) => {
        handleDragEvents(e);
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDraggingOver(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        handleDragEvents(e);
        setIsDraggingOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        handleDragEvents(e);
        setIsDraggingOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processImageFile(file);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const bubble = bubbleRef.current;
        if (!bubble) return;
        const rect = bubble.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const maxRotate = 15; // Max rotation in degrees
        const rotateX = (y - centerY) / centerY * -maxRotate;
        const rotateY = (x - centerX) / centerX * maxRotate;

        bubble.style.setProperty('--rotate-x', `${rotateX}deg`);
        bubble.style.setProperty('--rotate-y', `${rotateY}deg`);
    };

    const handleMouseLeave = () => {
        const bubble = bubbleRef.current;
        if (!bubble) return;
        // Smoothly transition back by setting variables
        bubble.style.setProperty('--rotate-x', '0deg');
        bubble.style.setProperty('--rotate-y', '0deg');
    };

    const ChatWindow = () => (
         <div 
            className={`chat-window ${!isOpen ? 'hidden' : ''}`} 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="chat-title"
            onDrop={handleDrop}
            onDragOver={handleDragEnter}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900/80">
                <h2 id="chat-title" className="text-xl font-serif font-bold text-white">{t('chat_title')}</h2>
                <div className="flex items-center gap-2">
                    <button onClick={clearChat} className="text-gray-400 hover:text-white" aria-label={t('chat_clear')}><Icon id="trash-2" className="w-5 h-5" /></button>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white" aria-label={t('chat_close')}><Icon id="close" className="w-6 h-6" /></button>
                </div>
            </div>
            <div className="chat-messages">
                {messages.length === 0 && (
                     <div className="chat-message ai">
                         <div className="bubble">
                            {t('chat_welcome')}
                         </div>
                    </div>
                )}
                {messages.map((msg) => (
                    <div key={msg.id} className={`chat-message ${msg.sender}`}>
                        <div className="bubble">
                            {msg.isLoading ? (
                                <div className="flex items-center justify-center gap-1.5 h-5">
                                    <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce"></span>
                                </div>
                            ) : (
                                <>
                                    {msg.imageUrl && <img src={msg.imageUrl} alt="User upload" className="rounded-lg mb-2" />}
                                    {msg.text && <p>{msg.text}</p>}
                                </>
                            )}
                            {msg.actions && (
                                <div className="chat-message-actions">
                                    {msg.actions.map(action => (
                                        <button key={action.label} onClick={() => handleActionClick(action)} className="chat-message-action-btn">{action.label}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
                {imagePreview && (
                    <div className="p-2 relative">
                        <img src={imagePreview.data} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
                        <button onClick={() => setImagePreview(null)} className="absolute top-0 right-0 bg-black/50 text-white rounded-full p-0.5">
                            <Icon id="close" className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="chat-input-wrapper">
                     <button type="button" onClick={() => fileInputRef.current?.click()} className="chat-input-btn" aria-label={t('chat_upload_photo')}>
                        <Icon id="image" className="w-5 h-5" />
                     </button>
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg" className="hidden" />
                     <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t('chat_placeholder')}
                        className="chat-input"
                        disabled={isLoading}
                        aria-label={t('chat_placeholder')}
                    />
                    <button type="submit" className="chat-input-btn" disabled={isLoading || (!inputValue.trim() && !imagePreview)} aria-label="Send message">
                        {isLoading ? <Icon id="loader" className="w-5 h-5 animate-spin" /> : <Icon id="send" className="w-5 h-5" />}
                    </button>
                </form>
            </div>
            {isDraggingOver && (
                <div className="chat-drop-overlay">
                    <div className="chat-drop-indicator">
                        <Icon id="download" className="w-12 h-12 text-white mb-4" />
                        <p className="text-white font-bold">{t('chat_drop_image')}</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            <button
                ref={bubbleRef}
                onClick={() => setIsOpen(true)}
                className="chat-bubble"
                aria-label={t('chat_open')}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <Icon id="message-circle" className="w-8 h-8 text-black" />
            </button>
            <ChatWindow />
        </>
    );
};

export default ChatAssistant;