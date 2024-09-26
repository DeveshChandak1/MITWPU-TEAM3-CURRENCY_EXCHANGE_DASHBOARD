// components/DurationSelector.js
export default function DurationSelector({ value, onChange }) {
    const durations = [
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly' },
      { value: 'yearly', label: 'Yearly' },
    ];
  
    return (
      <div className="mb-4">
        <label className="block mb-2">Select Duration</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {durations.map((duration) => (
            <option key={duration.value} value={duration.value}>
              {duration.label}
            </option>
          ))}
        </select>
      </div>
    );
  }