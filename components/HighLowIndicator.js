export default function HighLowIndicator({ data }) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📈 Highest and Lowest Rates</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-green-100 p-6 rounded-lg shadow-lg transition-transform hover:scale-105 duration-300">
            <h3 className="font-semibold text-green-600">Highest Rate</h3>
            {data.high !== undefined ? (
              <>
                <p className="text-gray-500 text-xl font-bold">{data.high.toFixed(4)}</p>
                {data.highDate && <p className="text-gray-500">Date: {data.highDate}</p>}
              </>
            ) : (
              <p>No data available</p>
            )}
          </div>
  
          <div className="bg-red-100 p-6 rounded-lg shadow-lg transition-transform hover:scale-105 duration-300">
            <h3 className="font-semibold text-red-600">Lowest Rate</h3>
            {data.low !== undefined ? (
              <>
                <p className="text-gray-500 text-xl font-bold">{data.low.toFixed(4)}</p>
                {data.lowDate && <p className="text-gray-500">Date: {data.lowDate}</p>}
              </>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
    );
  }
  