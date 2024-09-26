// components/ExchangeRateChart.js
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ExchangeRateChart({ data }) {
  return (
    <div className="h-96 mb-8">
      <h2 className="text-xl font-semibold mb-4">Exchange Rate Trend</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="rate" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

