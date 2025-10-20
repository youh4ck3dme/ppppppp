import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import SectionHeader from './SectionHeader';
import { Icon } from './Icons';

const AdminLogin: React.FC = () => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        // This is a mock login. In a real app, you'd verify the password against a backend.
        setTimeout(() => {
            if (password === 'papi-admin-2025') { // Mock password
                login();
            } else {
                setError(t('admin_wrong_password'));
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full animate-fade-in-up">
                <SectionHeader title={t('admin_login_title')} subtitle={t('admin_login_subtitle')} />
                <form onSubmit={handleLogin} className="content-pane !p-8 space-y-6">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('admin_password')}
                        className="form-input"
                        disabled={isLoading}
                        aria-label={t('admin_password')}
                    />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" className="btn-primary w-full" disabled={isLoading}>
                        {isLoading ? <Icon id="loader" className="w-6 h-6 animate-spin mx-auto" /> : t('admin_login_button')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
