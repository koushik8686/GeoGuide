import React from 'react';
import { Sun, CloudRain, Cloud, Wind } from 'lucide-react';

function WeatherCard({ city, weather }) {
  if (!weather) return null;
  console.log(city , weather)
  // Map weather conditions to icons
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return Sun;
      case 'Rain':
        return CloudRain;
      case 'Clouds':
        return Cloud;
      case 'Wind':
        return Wind;
      default:
        return Sun;
    }
  };

  const WeatherIcon = getWeatherIcon(weather.weather[0].main);

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{city}</h3>
        <WeatherIcon className="w-8 h-8 text-emerald-500" />
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</p>
        <p className="text-gray-600 capitalize">{weather.weather[0].description}</p>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-600">
          <div>
            <p>Humidity</p>
            <p className="font-medium">{weather.main.humidity}%</p>
          </div>
          <div>
            <p>Wind</p>
            <p className="font-medium">{weather.wind.speed} m/s</p>
          </div>
          <div>
            <p>Feels Like</p>
            <p className="font-medium">{Math.round(weather.main.feels_like)}°C</p>
          </div>
          <div>
            <p>Visibility</p>
            <p className="font-medium">{(weather.visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
