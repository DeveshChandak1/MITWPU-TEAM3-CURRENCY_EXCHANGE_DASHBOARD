// components/CurrencySelector.js
import { useState } from 'react';

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' },
];

export default function CurrencySelector({ label, value, onChange }) {
  const [search, setSearch] = useState('');

  const filteredCurrencies = currencies.filter(currency =>
    currency.code.toLowerCase().includes(search.toLowerCase()) ||
    currency.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-4">
      <label className="block mb-2">{label}</label>
      <input
        type="text"
        placeholder="Search currency"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {filteredCurrencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} - {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
}

