export interface WeatherData {
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
}

const mockWeatherConditions: WeatherData[] = [
    { temperature: 24, condition: 'sunny' },
    { temperature: 18, condition: 'cloudy' },
    { temperature: 15, condition: 'rainy' },
    { temperature: 21, condition: 'stormy' },
    { temperature: -2, condition: 'snowy' },
    { temperature: 28, condition: 'sunny' },
    { temperature: 19, condition: 'cloudy' },
];

/**
 * Simulates fetching weather data from an API.
 * In a real application, this would make an actual network request.
 * @returns {Promise<WeatherData>} A promise that resolves to mock weather data.
 */
export const getMockWeather = async (): Promise<WeatherData> => {
    // Return a random weather condition from the mock list.
    const randomIndex = Math.floor(Math.random() * mockWeatherConditions.length);
    return Promise.resolve(mockWeatherConditions[randomIndex]);
};