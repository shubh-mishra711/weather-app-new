import logo from './logo.svg';
import './App.css';
import Weather from './components/Weather';
import CurrencyConverter from './components/cc';
// import CurrencyConverter from './components/CurrencyConverter';

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
