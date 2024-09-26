import { useState } from "react";
import axios from "axios";

export default function CustomBasketManager() {
  const [baskets, setBaskets] = useState([]);
  const [newBasket, setNewBasket] = useState({ name: '', currencies: [] });
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [currency, setCurrency] = useState('');
  const [weight, setWeight] = useState('');
  const [basketValues, setBasketValues] = useState({});

  const addCurrencyToBasket = () => {
    if (!currency || !weight) return;
    setNewBasket(prev => ({
      ...prev,
      currencies: [...prev.currencies, { currency, weight }]
    }));
    setCurrency('');
    setWeight('');
  };

  const saveBasket = async () => {
    if (!newBasket.name || newBasket.currencies.length === 0) return;
    try {
      const response = await axios.post('http://localhost:5000/basket-value', {
        base_currency: baseCurrency,
        basket: newBasket.currencies
      });
      const basketValue = response.data.basket_value;
      const adjustedValue = basketValue / 1000;
      setBasketValues(prev => ({ ...prev, [newBasket.name]: adjustedValue }));
      setBaskets(prev => [...prev, newBasket]);
      setNewBasket({ name: '', currencies: [] });
    } catch (error) {
      console.error('Error saving basket:', error);
    }
  };

  return (
    <div className="mb-8 bg-white/60 backdrop-blur-lg p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🏦 Custom Currency Baskets
      </h2>

      {/* Create New Basket */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Basket Name"
          value={newBasket.name}
          onChange={(e) => setNewBasket(prev => ({ ...prev, name: e.target.value }))}
          className="p-3 border rounded-lg mr-4 w-full focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={saveBasket} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition ease-in-out">
          Save Basket
        </button>
      </div>

      {/* Add Currencies to Basket */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="p-3 border rounded-lg mr-4 w-1/2 focus:ring-2 focus:ring-green-400"
        />
        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="p-3 border rounded-lg mr-4 w-1/3 focus:ring-2 focus:ring-green-400"
        />
        <button onClick={addCurrencyToBasket} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition ease-in-out">
          Add to Basket
        </button>
      </div>

      {/* Display Current Basket Currencies */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Current Basket: <span className="font-bold">{newBasket.name || 'Untitled'}</span></h3>
        <ul className="list-disc pl-6">
          {newBasket.currencies.map((curr, index) => (
            <li key={index} className="text-gray-600">{curr.currency} - {curr.weight}</li>
          ))}
        </ul>
      </div>

      {/* Display Saved Baskets */}
      <div>
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Saved Baskets</h3>
        {baskets.length > 0 ? (
          baskets.map((basket, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4 shadow-md">
              <span className="font-bold text-gray-800">{basket.name}: </span>
              <span className="text-gray-700">{basketValues[basket.name] !== undefined ? `${basketValues[basket.name].toFixed(3)} ${baseCurrency}` : 'Calculating...'}</span>
              <ul className="list-disc pl-6">
                {basket.currencies.map((curr, idx) => (
                  <li key={idx} className="text-gray-600">{curr.currency} - {curr.weight}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No baskets added yet.</p>
        )}
      </div>
    </div>
  );
}
