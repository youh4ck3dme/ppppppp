import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    messages: ChatMessage[];
    addMessage: (message: Omit<ChatMessage, 'id'>) => void;
    updateLastMessage: (updates: Partial<ChatMessage>) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    userImageForTryOn: string | null;
    setUserImageForTryOn: (image: string | null) => void;
    userImageMimeType: string | null;
    setUserImageMimeType: (mimeType: string | null) => void;
    stylePromptForTryOn: string | null;
    setStylePromptForTryOn: (prompt: string | null) => void;
    clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const getInitialMessages = (): ChatMessage[] => {
    try {
        const item = window.localStorage.getItem('papi_chat_history');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.warn('Could not read chat history from localStorage', error);
        return [];
    }
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [userImageForTryOn, setUserImageForTryOn] = useState<string | null>(null);
    const [userImageMimeType, setUserImageMimeType] = useState<string | null>(null);
    const [stylePromptForTryOn, setStylePromptForTryOn] = useState<string | null>(null);


    useEffect(() => {
        try {
            // Filter out any temporary loading messages before saving
            const messagesToSave = messages.filter(m => !m.isLoading);
            window.localStorage.setItem('papi_chat_history', JSON.stringify(messagesToSave));
        } catch (error) {
            console.warn('Could not save chat history to localStorage', error);
        }
    }, [messages]);

    const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
        const newMessage = { ...message, id: Date.now().toString() + Math.random() };
        setMessages(prev => [...prev, newMessage]);
    }, []);
    
    const updateLastMessage = useCallback((updates: Partial<ChatMessage>) => {
        setMessages(prev => {
            if (prev.length === 0) return prev;
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            newMessages[newMessages.length - 1] = { ...lastMessage, ...updates };
            return newMessages;
        });
    }, []);

    const clearChat = useCallback(() => {
        setMessages([]);
        setUserImageForTryOn(null);
        setUserImageMimeType(null);
        setStylePromptForTryOn(null);
    }, []);

    return (
        <ChatContext.Provider value={{
            isOpen, setIsOpen, messages, addMessage, updateLastMessage, isLoading, setIsLoading, userImageForTryOn, setUserImageForTryOn, userImageMimeType, setUserImageMimeType, stylePromptForTryOn, setStylePromptForTryOn, clearChat
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};