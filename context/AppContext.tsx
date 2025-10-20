import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { NotificationProvider } from './NotificationContext';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import { SavedLooksProvider } from './SavedLooksContext';
import { ChatProvider } from './ChatContext';
import { ProfileNotificationProvider } from './ProfileNotificationContext';
import { ProductProvider } from './ProductContext';

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <ProductProvider>
            <CartProvider>
              <AuthProvider>
                <SavedLooksProvider>
                  <ChatProvider>
                    <ProfileNotificationProvider>
                      {children}
                    </ProfileNotificationProvider>
                  </ChatProvider>
                </SavedLooksProvider>
              </AuthProvider>
            </CartProvider>
          </ProductProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
