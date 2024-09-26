export const generateMockData = (duration) => {
    const data = [];
    const now = new Date();
    let high = { date: '', rate: 0 };
    let low = { date: '', rate: Infinity };
  
    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };
  
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
  
    let interval;
    if (duration === 'weekly') {
      interval = 1; // daily data for a week
    } else if (duration === 'monthly') {
      interval = 7; // weekly data for a month
    } else if (duration === 'yearly') {
      interval = 30; // monthly data for a year
    }
  
    for (let i = 0; i < (duration === 'weekly' ? 7 : duration === 'monthly' ? 4 : 12); i++) {
      const date = addDays(now, -i * interval);
      const rate = (Math.random() * (1.3 - 1.0) + 1.0).toFixed(2);
      data.push({ date: formatDate(date), rate: parseFloat(rate) });
  
      if (rate > high.rate) {
        high = { date: formatDate(date), rate: parseFloat(rate) };
      }
      if (rate < low.rate) {
        low = { date: formatDate(date), rate: parseFloat(rate) };
      }
    }
  
    return { rates: data.reverse(), high, low };
  };