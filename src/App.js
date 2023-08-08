import logo from './logo.svg';
import './App.css';
import Weather from './components/Weather';
import CurrencyConverter from './components/cc';
// import CurrencyConverter from './components/CurrencyConverter';
import { init as initApm } from '@elastic/apm-rum'


initApm({

  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: 'weatherapp',

  serverUrl: 'https://a87c533a6a144bbe9dd0931d52cd0fe5.apm.us-central1.gcp.cloud.es.io:443',

  serviceVersion: '',

  environment: 'my-app-environment',

  logLevel: "debug"
})

function App() {
  return (
    <div className="App">
      <div style={{ flex: '100%', padding: '10px' }}>
        <CurrencyConverter />
      </div>
    </div>
    
  );
}

export default App;
