import { useState, useEffect } from 'react';

export default function RiskIndicator({ currency1, currency2, duration }) {
  const [volatility, setVolatility] = useState(null);
  const [riskLevel, setRiskLevel] = useState('');

  useEffect(() => {
    fetchVolatilityAndRisk(currency1, currency2, duration);
  }, [currency1, currency2, duration]);

  const fetchVolatilityAndRisk = async (cur1, cur2, dur) => {
    try {
      const response = await fetch('http://localhost:5000/currency-volatility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency1: cur1, currency2: cur2, duration: dur })
      });

      const result = await response.json();
      setVolatility(result.volatility);

      setRiskLevel(result.volatility < 0.01 ? 'Low' : result.volatility < 0.02 ? 'Medium' : 'High');
    } catch (error) {
      console.error('Error fetching volatility or risk data:', error);
    }
  };

  return (
    <div className="mb-8 p-6 bg-white/60 backdrop-blur-md rounded-lg shadow-lg transition-transform hover:scale-105 duration-500">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">⚠️ Risk Indicator and Volatility</h2>
      <p className="mb-3">
        The current risk level for <strong>{currency1}/{currency2}</strong> over the <strong>{duration}</strong> period is:
        <span className={`ml-2 font-bold ${riskLevel === 'Low' ? 'text-green-500' : riskLevel === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
          {riskLevel}
        </span>
      </p>
      <p>
        Volatility for the selected period: 
        <span className="font-bold ml-2">{volatility !== null ? volatility.toFixed(4) : 'Calculating...'}</span>
      </p>
    </div>
  );
}
