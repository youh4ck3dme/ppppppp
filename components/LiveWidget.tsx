import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { getMockWeather, WeatherData } from '../services/weatherService';
import { Icon, IconId } from './Icons';

const LiveWidget: React.FC = () => {
    const { language } = useTranslation();
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timerId = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' }));
            setDate(new Intl.DateTimeFormat(language, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
            }).format(now));
        }, 1000);

        return () => clearInterval(timerId);
    }, [language]);

    useEffect(() => {
        const fetchWeather = async () => {
            setIsLoading(true);
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            const weatherData = await getMockWeather();
            setWeather(weatherData);
            setIsLoading(false);
        };
        fetchWeather();
    }, []);
    
    const getWeatherIcon = (condition: string): IconId => {
        switch (condition) {
            case 'sunny': return 'sun';
            case 'cloudy': return 'cloud';
            case 'rainy': return 'cloud-rain';
            case 'stormy': return 'cloud-lightning';
            case 'snowy': return 'cloud-snow';
            default: return 'sun';
        }
    };

    const renderLoadingState = () => (
        <div className="flex items-center gap-2 animate-pulse">
            <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
            <div className="w-24 h-5 bg-gray-700 rounded-md"></div>
        </div>
    );
    
    const renderWidgetContent = () => (
        <div className="flex items-center gap-3">
            {weather && (
                <div className="flex items-center gap-1.5" title={`${weather.temperature}°C`}>
                    <Icon id={getWeatherIcon(weather.condition)} className="w-6 h-6 text-gray-300" />
                    <span className="font-semibold text-lg text-white">{weather.temperature}°</span>
                </div>
            )}
            <div className="hidden sm:block">
                <p className="font-bold text-lg text-white leading-none">{time}</p>
                <p className="text-xs text-gray-400 leading-none">{date}</p>
            </div>
        </div>
    );

    return (
        <div 
            className="flex items-center h-10 px-4 bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-full backdrop-blur-sm"
            aria-label="Current time, date, and weather"
        >
            {isLoading ? renderLoadingState() : renderWidgetContent()}
        </div>
    );
};

export default LiveWidget;
