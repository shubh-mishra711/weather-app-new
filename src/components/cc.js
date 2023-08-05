import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './cc.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1'); // Change the initial value of amount to a string
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('CAD');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [error, setError] = useState('');
  const [countryDetails, setCountryDetails] = useState(null);
  const [countries, setCountries] = useState([]);
  const [weather, setWeather] = useState(null);
  const [placeInfo, setPlaceInfo] = useState('');
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [mapZoom, setMapZoom] = useState(1);

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    if (toCurrency) {
      fetchCountryDetails(toCurrency);
    }
  }, [toCurrency]);

  useEffect(() => {
    if (countryDetails) {
      fetchWeather(countryDetails.capital[0]);
      fetchPlaceInfo(countryDetails.name.common);
    }
  }, [countryDetails]);

  const convertCurrency = async () => {
    setError('');

    const apiKey = 'YOUR_API_KEY'; // Replace with your API key
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const { rates } = response.data;
        const conversionRate = rates[toCurrency];
        const convertedAmount = amount * conversionRate;
        setConvertedAmount(convertedAmount.toFixed(2));
        fetchCountriesByCurrency(toCurrency);
      } else {
        setError('Currency conversion failed.');
      }
    } catch (error) {
      setError('Failed to fetch currency rates.');
    }
  };
  const fetchCountryDetails = async (currencyCode) => {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/currency/${currencyCode}`);
      if (response.status === 200) {
        const countryData = response.data[0];
        setCountryDetails(countryData);
      }
    } catch (error) {
      console.error('Failed to fetch country details:', error);
    }
  };

  const fetchCountriesByCurrency = async (currencyCode) => {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/currency/${currencyCode}`);
      if (response.status === 200) {
        const countriesData = response.data;
        setCountries(countriesData);
      }
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const fetchWeather = async (city) => {
    const apiKey = 'f4df215b2d6889811eee837bb7889650'; // Replace with your API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        const weatherData = response.data;
        setWeather(weatherData);
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    }
  };

  const fetchPlaceInfo = async (countryName) => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`
      );
      if (response.status === 200) {
        const placeInfo = response.data.extract;
        setPlaceInfo(placeInfo);
        fetchMapCoordinates(countryName);
      }
    } catch (error) {
      console.error('Failed to fetch place information:', error);
    }
  };
  


  const fetchMapCoordinates= async (countryName) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(countryName)}`
      );
      if (response.status === 200 && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setMapCenter([lat, lon]);
        setMapZoom(2);
      }
    } catch (error) {
      console.error('Failed to fetch map coordinates:', error);
    }
  };


  const handleAmountChange = (e) => {
    const newAmount = Math.max(0, e.target.value); // Ensure the new amount is not go below 0
    setAmount(newAmount !== 0 ? newAmount.toString() : ''); // Convert the new amount tostring and set it to empty string if it is 0
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  const handleCountryChange = (e) => {
    const selectedCountryCode = e.target.value;
    const selectedCountry = countries.find((country) => country.cca3 === selectedCountryCode);
    setCountryDetails(selectedCountry);
    setWeather(null);
  };

  const handleConvertClick = () => {
    convertCurrency();
  };
  
  return (
    <div className="background">
    <div className="header-container">
    <div className="box">
      <h1 className="header-title">Currency Converter</h1>
    </div>
    </div>
      <div className="container">
      <div className="Currency">
        <h1 className="title">Currency Converter</h1>
        <div className="form-group">
          <label className="label">Amount:</label>
          <input className="input" type="number" value={amount} onChange={handleAmountChange} />
        </div>
        <div className="form-group">
          <label className="label">From:</label>
          <select className="select" value={fromCurrency} onChange={handleFromCurrencyChange}>
            <option value="USD">US Dollar</option>
            <option value="EUR">Euro</option>
            <option value="GBP">Great Britain Pounds</option>
            <option value="INR">Indian Rupees</option>
            <option value="JPY">Japanese Yen</option>
            <option value="CAD">Canadian Dollar</option>
            <option value="CNY">Chinese Yuan</option>
            <option value="CHF">Swiss franc</option>
            
            <option value="PLN">Polish Złoty</option>
            {/* Add more currency options as needed */}
          </select>
        </div>
        <div className="form-group">
          <label className="label">To:</label>
          <select className="select" value={toCurrency} onChange={handleToCurrencyChange}>
            <option value="">Select Currency</option>
            <option value="USD">US Dollar</option>
            <option value="EUR">Euro</option>
            <option value="GBP">Great Britain Pounds</option>
            <option value="INR">Indian Rupees</option>
            <option value="JPY">Japanese Yen</option>
            <option value="CAD">Canadian Dollar</option>
            <option value="CNY">Chinese Yuan</option>
            <option value="CHF">Swiss franc</option>
            <option value="PLN">Polish Złoty</option>
            {/* Add more currency options as needed */}
          </select>
        </div>
        <button className="button" onClick={handleConvertClick} disabled={!toCurrency}>
          Convert
        </button>
        {error && <div className="error">{error}</div>}
        <div className="result">
          Converted Amount: {convertedAmount} {toCurrency}
        </div>
        </div>
        {countries.length > 0 && (
          <div className="country-dropdown">
            <label className="label">Select a Country:</label>
            <select className="select" onChange={handleCountryChange}>
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.cca3} value={country.cca3}>
                 {country.name.common}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {countries.length > 0 && countryDetails && weather && (
          <div className="details-container">
            <div className="country-details">
            <h2 className="country-details-heading">Country Details</h2>
            <div className="country-details-content">
              <div className="flag-container">
                <img
                  src={countryDetails.flags.png}
                  alt={countryDetails.name.common}
                  className="country-flag"
                />
              </div>
              <div className="country-details-info">
                <p>Name: {countryDetails.name.common}</p>
                <p>Capital: {countryDetails.capital[0]}</p>
                <p>Population: {countryDetails.population}</p>
                {/* Add more country details as needed */}
              </div>
            </div>
            </div>
            <div className="weather-details">
            <h2 className="weather-heading">Weather Details</h2>
            <div className="weather-content">
              <div className="weather-icon-container">
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="Weather Icon"
                  className="weather-icon"
                />
              </div>
              <div className="weather-info">
                <p>Location: {countryDetails.name.common}</p>
                <p>Temperature: {weather.main.temp}°C</p>
                <p className="weather-w">Weather: {weather.weather[0].description}</p>
                <p className="weather-humidity">Humidity: {weather.main.humidity}%</p>
                <p className="weather-wind">Wind: {weather.wind.speed} km/h</p>
                <p className="weather-pressure">Pressure: {weather.main.pressure} hPa</p>
                {/* Add more weather details as needed */}
              </div>
            </div>
            </div>
          </div>
        )}


        {countryDetails && (
          <div className="country-facts">
            <h2 className="country-facts-heading">Facts About The Country</h2>
            <div className="country-facts-content">
              <p>1. The Area of the country is {countryDetails.area} km²</p>
              <p>2. The Region where it is present is  {countryDetails.region}</p>
              <p>3. The Subregion is/are {countryDetails.subregion}</p>
             
              <p>5. Languages used in these country is/are {Object.values(countryDetails.languages).join(', ')} etc </p>
              {/* Add more country facts as needed */}
            </div>
          </div>
        )}
        

        {placeInfo && (
          <div className="place-info">
            <h2 className="place-info-heading">Place Information</h2>
            <p className="place-info-content">{placeInfo}</p>
            <div className="map-container">
            <iframe
              title="Map"
              width="300"
              height="200"
              src={`https://maps.google.com/maps?q=${mapCenter[0]},${mapCenter[1]}&z=6&output=embed`}
            />
            </div>
          </div>
        )}
      </div>
      <div className="footer-container">
      <p className="footer-text">
        &copy; {new Date().getFullYear()} Currency Converter. All rights reserved.
      </p>
    </div>
    </div>
    
  );
};

export default CurrencyConverter;


