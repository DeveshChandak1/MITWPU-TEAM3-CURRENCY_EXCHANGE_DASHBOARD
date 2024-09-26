# Currency Exchange Dashboard

This project is a **Currency Exchange Dashboard** that allows users to analyze and compare exchange rates between two currencies. Users can visualize historical trends, calculate custom currency baskets, and assess volatility and risk levels for selected currency pairs.
Team No.3
Team Members:
Devesh,
Diya,
Gaurav,
Harsh,
Krishna

## Features

1. **Currency Selection and Exchange Rate Visualization**
   - Users can select two currencies for comparison (e.g., USD and EUR) and visualize the exchange rate trend over a selected duration, such as:
     - **Weekly**
     - **Monthly**
     - **Quarterly**
     - **Yearly**
   - The exchange rate trend is displayed as a line graph, allowing users to see how rates have fluctuated over time.
   - in Weekly if we use merged file(2012-2022) it will not show because of huge date points but if we use a single year then it will show
   - **we can change the csv file app.py line 22**
   - **data = pd.read_csv(r'merged_output.csv')**
   - Use the provided file because we have to change the column name in csv file to for example: Indian Rupee (INR) to INR

2. **Highest and Lowest Exchange Rates**
   - Displays the **highest** and **lowest** exchange rates for the selected currency pair during the chosen time period.
   - **USD/EUR**
     - **Highest Rate**: 1.3823 (2014-03-31)
     - **Lowest Rate**: 1.0147 (2022-08-31)

3. **Custom Currency Baskets**
   - Users can create a custom basket of multiple currencies, each with a specified weight.
   - The value of the custom basket is calculated against a base currency.
   - Example:
     - **Basket Name**: `test3`
     - **USD** - Weight: 0.5
     - **JPY** - Weight: 0.4
     - **EUR** - Weight: 0.1

4. **Risk Indicator and Volatility**
   - A **Risk Indicator** feature calculates the volatility of the selected currency pair for the chosen period.
   - The indicator shows if the risk level is **High**, **Medium**, or **Low**.
   - Volatility is displayed numerically. For example, the volatility for the USD/EUR pair is **1.4934**, indicating **High Risk**.

## Screenshots

### Currency Selection Interface
![Screenshot 2024-09-26 093127](https://github.com/user-attachments/assets/a57cd8df-71f2-4498-95ad-e53dbec7e009)



### Exchange Rate Trend Graph
![Screenshot 2024-09-26 110040](https://github.com/user-attachments/assets/c7356f59-796c-46ef-882a-f151414700f4)


### Highest and Lowest Rates
![Screenshot 2024-09-26 093159](https://github.com/user-attachments/assets/9c93f2fa-9292-461a-b97b-6c7dab2c0900)


### Custom Currency Basket
![Screenshot 2024-09-26 093336](https://github.com/user-attachments/assets/f07aba6d-23d7-4cb7-bd9b-02770714ed80)



### Risk Indicator and Volatility
![Screenshot 2024-09-26 093344](https://github.com/user-attachments/assets/15283f5e-0552-4f1f-8298-9f0feb97a49a)


## Future Enhancements

- **Real-Time Exchange Rates:** Implement a real-time exchange rate service to provide the most up-to-date information.
- **Database Integration:** Automate the upload of exchange rate data into a database to streamline updates.
- **Historical Data Comparison:** Add a feature for comparing historical data with forecasted trends to predict future currency movements.
- **Real-Time Volatility Alerts:** Create a notification system that alerts users when certain currency pairs exceed a predefined volatility threshold.
- **ML Based Prediction:** We will use ML to predict the future trend of exchange rate . 

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DeveshChandak1/MITWPU-TEAM3-CURRENCY_EXCHANGE_DASHBOARD.git













This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
