"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import CurrencySelector from "../components/CurrencySelector";
import DurationSelector from "../components/DurationSelector";
import HighLowIndicator from "../components/HighLowIndicator";
import CustomBasketManager from "../components/CustomBasketManager";
import RiskIndicator from "../components/RiskIndicator";
import PuffLoader from "react-spinners/PuffLoader";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  const [currency1, setCurrency1] = useState("USD");
  const [currency2, setCurrency2] = useState("EUR");
  const [duration, setDuration] = useState("monthly");
  const [chartData, setChartData] = useState(null);
  const [highLowData, setHighLowData] = useState({ high: 0, low: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currency1 && currency2 && duration) {
      fetchExchangeRateData(currency1, currency2, duration);
    }
  }, [currency1, currency2, duration]);

  const fetchExchangeRateData = async (cur1, cur2, dur) => {
    setIsLoading(true);
    setError(null);
    setChartData(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/exchange-rate-chart",
        { currency1: cur1, currency2: cur2, duration: dur }
      );

      const { chartData, highRate, lowRate, highRateDate, lowRateDate } = response.data;

      setHighLowData({ high: highRate || 0, low: lowRate || 0, highDate: highRateDate, lowDate: lowRateDate });

      const formattedChartData = {
        labels: chartData.dates,
        datasets: [
          {
            label: `${cur1} to ${cur2} Exchange Rate Trend`,
            data: chartData.exchange_rates,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light shade under the line
            fill: true, // Enable the shaded area below the line
            tension: 0.1, // Optional: adds a curve to the line
          }
        ]
      };

      setChartData(formattedChartData);
    } catch (err) {
      setError("Failed to fetch exchange rate data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative container mx-auto p-8 max-w-5xl bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-300 rounded-xl shadow-2xl overflow-hidden">
      {/* Background circles for depth */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>

      <h1 className="text-5xl font-bold text-gray-900 mb-8 text-center">
        🌍 Currency Exchange Dashboard 🌍
      </h1>
      
      <div className="bg-white/60 backdrop-blur-md shadow-lg rounded-lg p-8 mb-8 transition transform hover:scale-105 duration-500 ease-in-out">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencySelector
            label="Currency 1"
            value={currency1}
            onChange={setCurrency1}
          />
          <CurrencySelector
            label="Currency 2"
            value={currency2}
            onChange={setCurrency2}
          />
        </div>
        <DurationSelector value={duration} onChange={setDuration} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <PuffLoader size={60} color="#fff" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center font-semibold text-lg">{error}</p>
      ) : (
        chartData && (
          <div className="grid gap-8">
            <div className="bg-white/70 backdrop-blur-lg p-8 rounded-lg shadow-2xl transition transform hover:scale-105 duration-500 ease-in-out" style={{ height: '500px' }}>
              <Line
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      ticks: { color: "#333" },
                      grid: { color: "rgba(75,192,192,0.3)" },
                    },
                    y: {
                      ticks: { color: "#333" },
                      grid: { color: "rgba(75,192,192,0.3)" },
                    },
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: "#333",
                      },
                    },
                  },
                  responsive: true,
                }}
              />
            </div>

            <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 p-6 rounded-lg shadow-lg transition transform hover:scale-105 duration-500 ease-in-out text-white">
              <HighLowIndicator
                data={highLowData}
              />
            </div>

            <div className="bg-white/60 backdrop-blur-md p-6 rounded-lg shadow-2xl transition transform hover:scale-105 duration-500 ease-in-out">
              <CustomBasketManager />
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-lg shadow-2xl transition transform hover:scale-105 duration-500 ease-in-out">
              <RiskIndicator
                currency1={currency1}
                currency2={currency2}
                duration={duration}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}
