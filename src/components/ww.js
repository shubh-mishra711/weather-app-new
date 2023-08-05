import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ww.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [cityHistory, setCityHistory] = useState('');
  const [error, setError] = useState('');

  const apiKey = 'f4df215b2d6889811eee837bb7889650'; // Replace with your OpenWeatherMap API key

  const fetchWeather = async (city) => {
    setError('');

    try {
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      setCurrentWeather(currentWeatherResponse.data);
      setForecast(forecastResponse.data);
      fetchCityHistory(city);
    } catch (error) {
      setError('Failed to fetch weather data.');
    }
  };

  const fetchCityHistory = async (city) => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${city}`
      );

      const history = response.data.extract;
      setCityHistory(history);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, [city]);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div>
    <div className="weather-container">
      <h1 className="weather-title">Weather App</h1>
      <div className="weather-form">
        <input
          className="weather-input"
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleCityChange}
        />
      </div>

      {currentWeather && forecast ? (
        <div className="weather-info">
          <div className="weather-current">
            <h2 className="weather-heading">Current Weather</h2>
            <div className="weather-details">
              <div className="weather-description">{currentWeather.weather[0].description}</div>
              <div className="weather-temp">{currentWeather.main.temp}°C</div>
              <div className="weather-icon">
                <img
                  src={`https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
                  alt="Weather Icon"
                />
              </div>
            </div>
          </div>
          <div className="weather-forecast">
            <h2 className="weather-heading">Upcoming Weather</h2>
            <div className="forecast-details">
              {forecast.list.slice(0, 5).map((item) => (
                <div key={item.dt} className="forecast-item">
                  <div className="forecast-date">{item.dt_txt}</div>
                  <div className="forecast-description">{item.weather[0].description}</div>
                  <div className="forecast-temp">{item.main.temp}°C</div>
                  <div className="forecast-icon">
                    <img
                      src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`}
                      alt="Weather Icon"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      ) : (
        <div className="weather-error">{error}</div>
      )}
      <div className="weather-history-container">
      <div className="weather-history">
      <h2 className="weather-heading">City History</h2>
      <div className="history-details">{cityHistory}</div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Weather;
