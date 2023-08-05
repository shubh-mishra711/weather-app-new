const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.get('/api/currency-chart/:fromCurrency/:toCurrency', async (req, res) => {
  const { fromCurrency, toCurrency } = req.params;
  const startDate = '2022-06-30';
  const endDate = '2022-06-01';
  const apiUrl = `https://api.exchangerate-api.com/v4/convert/${fromCurrency}/${toCurrency}?start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch currency chart data.' });
  }
});

const PORT = 5000; // Choose a port for your server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
