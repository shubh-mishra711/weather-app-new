import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

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
      } else {
        setError('Currency conversion failed.');
      }
    } catch (error) {
      setError('Failed to fetch currency rates.');
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  return (
    <div className="container">
      <h1 className="title">Currency Converter</h1>
      <div className="form-group">
        <label className="label">Amount:</label>
        <input className="input" type="number" value={amount} onChange={handleAmountChange} />
      </div>
      <div className="form-group">
        <label className="label">From:</label>
        <select className="select" value={fromCurrency} onChange={handleFromCurrencyChange}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          {/* Add more currency options as needed */}
        </select>
      </div>
      <div className="form-group">
        <label className="label">To:</label>
        <select className="select" value={toCurrency} onChange={handleToCurrencyChange}>
          <option value="INR">INR</option>
          <option value="JPY">JPY</option>
          <option value="CAD">CAD</option>
          {/* Add more currency options as needed */}
        </select>
      </div>
      <button className="button" onClick={convertCurrency}>Convert</button>
      {error && <div className="error">{error}</div>}
      <div className="result">
        Converted Amount: {convertedAmount} {toCurrency}
      </div>
    </div>
  );
};

export default CurrencyConverter;
