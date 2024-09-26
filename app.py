import matplotlib
import base64
import logging
import numpy as np
import pandas as pd
import io
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import matplotlib.pyplot as plt

# Use non-interactive backend
matplotlib.use('Agg')

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)

# Load currency data
# data = pd.read_csv(r'Exchange_Rate_Report_2022.csv')
data = pd.read_csv(r'merged_output.csv')

data.columns = data.columns.str.strip()
data['Date'] = pd.to_datetime(data['Date'], format='%d-%b-%y', errors='coerce')
data.dropna(subset=['Date'], inplace=True)

@app.route('/exchange-rate-chart', methods=['POST'])
def exchange_rate_chart():
    logging.debug("Received request to generate exchange rate chart")
    
    req_data = request.get_json()
    currency1 = req_data.get('currency1')
    currency2 = req_data.get('currency2')
    duration = req_data.get('duration', 'weekly').lower()

    if currency1 not in data.columns or currency2 not in data.columns:
        logging.error(f'Invalid currency selection: {currency1}, {currency2}')
        return jsonify({'error': f'Invalid currency selection: {currency1}, {currency2}'}), 400

    selected_data = data[['Date', currency1, currency2]].copy()
    selected_data[currency1] = pd.to_numeric(selected_data[currency1], errors='coerce')
    selected_data[currency2] = pd.to_numeric(selected_data[currency2], errors='coerce')
    selected_data.dropna(inplace=True)

    selected_data['Exchange_Rate'] = selected_data[currency1] / selected_data[currency2]
    selected_data.set_index('Date', inplace=True)

    # Resample based on the duration
    if duration == 'weekly':
        trend = selected_data['Exchange_Rate'].resample('W').mean()
    elif duration == 'monthly':
        trend = selected_data['Exchange_Rate'].resample('ME').mean()
    elif duration == 'quarterly':
        trend = selected_data['Exchange_Rate'].resample('QE').mean()
    elif duration == 'yearly':
        trend = selected_data['Exchange_Rate'].resample('YE').mean()
    else:
        logging.error(f'Invalid duration: {duration}')
        return jsonify({'error': f'Invalid duration: {duration}'}), 400

    # Check if trend is empty
    if trend.empty:
        return jsonify({'error': 'No data available for the selected duration'}), 400

    # Find the highest and lowest rates and their corresponding dates
    highest_rate = trend.max()
    highest_rate_date = trend.idxmax().strftime('%Y-%m-%d')  

    lowest_rate = trend.min()
    lowest_rate_date = trend.idxmin().strftime('%Y-%m-%d')   

    chart_data = {
        'dates': trend.index.strftime('%Y-%m-%d').tolist(),
        'exchange_rates': trend.tolist(),
    }

    return jsonify({
        'chartData': chart_data,
        'highRate': float(highest_rate) if not pd.isna(highest_rate) else None,
        'highRateDate': highest_rate_date,  
        'lowRate': float(lowest_rate) if not pd.isna(lowest_rate) else None,
        'lowRateDate': lowest_rate_date,
    })

    logging.debug("Received request to generate exchange rate chart")
    
    req_data = request.get_json()
    currency1 = req_data.get('currency1')
    currency2 = req_data.get('currency2')
    duration = req_data.get('duration', 'weekly').lower()

    if currency1 not in data.columns or currency2 not in data.columns:
        logging.error(f'Invalid currency selection: {currency1}, {currency2}')
        return jsonify({'error': f'Invalid currency selection: {currency1}, {currency2}'}), 400

    selected_data = data[['Date', currency1, currency2]].copy()
    selected_data[currency1] = pd.to_numeric(selected_data[currency1], errors='coerce')
    selected_data[currency2] = pd.to_numeric(selected_data[currency2], errors='coerce')
    selected_data.dropna(inplace=True)

    selected_data['Exchange_Rate'] = selected_data[currency1] / selected_data[currency2]
    selected_data.set_index('Date', inplace=True)

    # Resample based on the duration
    if duration == 'weekly':
        trend = selected_data['Exchange_Rate'].resample('W').mean()
    elif duration == 'monthly':
        trend = selected_data['Exchange_Rate'].resample('ME').mean()
    elif duration == 'quarterly':
        trend = selected_data['Exchange_Rate'].resample('QE').mean()
    elif duration == 'yearly':
        trend = selected_data['Exchange_Rate'].resample('YE').mean()
    else:
        logging.error(f'Invalid duration: {duration}')
        return jsonify({'error': f'Invalid duration: {duration}'}), 400

    # Find the highest and lowest rates and their corresponding dates
    highest_rate = trend.max()
    highest_rate_date = trend.idxmax().strftime('%Y-%m-%d')  

    lowest_rate = trend.min()
    lowest_rate_date = trend.idxmin().strftime('%Y-%m-%d')   

    chart_data = {
        'dates': trend.index.strftime('%Y-%m-%d').tolist(),
        'exchange_rates': trend.tolist(),
    }

    return jsonify({
        'chartData': chart_data,
        'highRate': highest_rate,
        'highRateDate': highest_rate_date,  
        'lowRate': lowest_rate,
        'lowRateDate': lowest_rate_date,
    })


@app.route('/basket-value', methods=['POST'])
def basket_value():
    req_data = request.get_json()
    base_currency = req_data.get('base_currency', 'USD')  # Default base currency
    basket = req_data.get('basket', [])
    
    if not basket:
        return jsonify({'error': 'Basket is empty'}), 400

    basket_value = 0.0

    for item in basket:
        currency = item.get('currency')
        weight = float(item.get('weight', 1.0))  # Convert weight to float

        if currency not in data.columns or base_currency not in data.columns:
            return jsonify({'error': f'Invalid currency: {currency} or {base_currency}'}), 400
        
        # Get the latest exchange rate
        latest_row = data[['Date', base_currency, currency]].dropna().iloc[-1]
        latest_rate = latest_row[currency] / latest_row[base_currency]
        
        # Ensure latest_rate is a float
        latest_rate = float(latest_rate)
        
        # Add weighted exchange rate to the basket value
        basket_value += weight * latest_rate

    return jsonify({
        'basket_value': basket_value,
        'base_currency': base_currency,
    })





@app.route('/currency-volatility', methods=['POST'])
def currency_volatility():
    req_data = request.get_json()
    currency1 = req_data.get('currency1')
    currency2 = req_data.get('currency2')
    duration = req_data.get('duration', '30d').lower()  # Default to 30 days

    # Prepare the data
    selected_data = data[['Date', currency1, currency2]].copy()
    selected_data[currency1] = pd.to_numeric(selected_data[currency1], errors='coerce')
    selected_data[currency2] = pd.to_numeric(selected_data[currency2], errors='coerce')
    selected_data.dropna(inplace=True)

    # Calculate returns
    selected_data['Returns'] = selected_data[currency1] / selected_data[currency2] - 1  # Calculate simple returns
    selected_data.set_index('Date', inplace=True)

    # Resample data based on the selected duration
    if duration == 'weekly':
        resampled_data = selected_data['Returns'].resample('W').mean()
    elif duration == 'monthly':
        resampled_data = selected_data['Returns'].resample('M').mean()
    elif duration == 'quarterly':
        resampled_data = selected_data['Returns'].resample('Q').mean()
    elif duration == 'yearly':
        resampled_data = selected_data['Returns'].resample('Y').mean()
    else:
        logging.error(f'Invalid duration: {duration}')
        return jsonify({'error': f'Invalid duration: {duration}'}), 400

    # Check if resampled_data is empty
    if resampled_data.empty:
        return jsonify({'error': 'No data available for the selected duration'}), 400

    # Calculate volatility (standard deviation of returns)
    volatility = resampled_data.std() * np.sqrt(252)  # Annualized volatility assuming 252 trading days in a year

    # Handle NaN values in resampled data
    chart_dates = resampled_data.index.strftime('%Y-%m-%d').tolist()
    chart_values = [v if not pd.isna(v) else None for v in resampled_data.tolist()]

    return jsonify({
        'volatility': float(volatility) if not pd.isna(volatility) else None,
        'currency1': currency1,
        'currency2': currency2,
        'duration': duration.capitalize(),  # Capitalize for better presentation
        'chartData': {
            'dates': chart_dates,
            'values': chart_values
        }
    })

    req_data = request.get_json()
    currency1 = req_data.get('currency1')
    currency2 = req_data.get('currency2')
    duration = req_data.get('duration', '30d').lower()  # Default to 30 days

    # Prepare the data
    selected_data = data[['Date', currency1, currency2]].copy()
    selected_data[currency1] = pd.to_numeric(selected_data[currency1], errors='coerce')
    selected_data[currency2] = pd.to_numeric(selected_data[currency2], errors='coerce')
    selected_data.dropna(inplace=True)

    # Calculate returns
    selected_data['Returns'] = selected_data[currency1] / selected_data[currency2] - 1  # Calculate simple returns
    selected_data.set_index('Date', inplace=True)

    # Resample data based on the selected duration
    if duration == 'weekly':
        resampled_data = selected_data['Returns'].resample('W').mean()
    elif duration == 'monthly':
        resampled_data = selected_data['Returns'].resample('M').mean()
    elif duration == 'quarterly':
        resampled_data = selected_data['Returns'].resample('Q').mean()
    elif duration == 'yearly':
        resampled_data = selected_data['Returns'].resample('Y').mean()
    else:
        logging.error(f'Invalid duration: {duration}')
        return jsonify({'error': f'Invalid duration: {duration}'}), 400

    # Calculate volatility (standard deviation of returns)
    volatility = resampled_data.std() * np.sqrt(252)  # Annualized volatility assuming 252 trading days in a year


    # Handle NaN values

    return jsonify({
        'volatility': volatility,
        'currency1': currency1,
        'currency2': currency2,
        'duration': duration.capitalize(),  # Capitalize for better presentation
        
    })



if __name__ == '__main__':
    app.run(debug=True)
