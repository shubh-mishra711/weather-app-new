import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState('');
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState('');

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const fetchWeatherData = async () => {
    setLoadingWeather(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f4df215b2d6889811eee837bb7889650&units=metric`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setWeather(data);
      fetchCityHistory();
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data');
    } finally {
      setLoadingWeather(false);
    }
  };

  const fetchCityHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`
      );

      const cityHistory = response.data.extract;
      setHistory(cityHistory || '');
    } catch (error) {
      console.error('Error fetching city history:', error);
      setHistory('');
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="weather-container">
      <h2 className="weather-title">Weather</h2>
      <div className="weather-input">
        <input type="text" placeholder="Enter city name" value={city} onChange={handleCityChange} />
        <button onClick={fetchWeatherData}>Get Weather</button>
      </div>
      {loadingWeather && <p className="weather-loading">Loading weather...</p>}
      {loadingHistory && <p className="weather-loading">Loading city information...</p>}
      {error && <p className="weather-error">{error}</p>}
      {weather && (
        <div className="weather-info">
          <div className="weather-icon">
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt="Weather Icon"
            />
          </div>
          <div className="weather-details">
            <p className="weather-description">{weather.weather[0].description}</p>
            <p className="weather-temperature">{Math.round(weather.main.temp)}°C</p>
            <p className="weather-humidity">Humidity: {weather.main.humidity}%</p>
            <p className="weather-wind">Wind: {weather.wind.speed} km/h</p>
            <p className="weather-pressure">Pressure: {weather.main.pressure} hPa</p>
          </div>
        </div>
      )}
      {history && (
        <div className="weather-history">
          <h3 className="weather-history-title">Place Info.</h3>
          <p className="weather-history-text">{history}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
