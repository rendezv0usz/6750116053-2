# NOVA Cafe BI Dashboard

A responsive business-intelligence dashboard for exploring NOVA Cafe transactions, sales, profitability, customer ratings, product categories, and sales channels.

## Features

- KPI cards and sales/profit visualizations
- Filters for location, category, campaign, and channel
- Transaction table preview
- Embedded sample CSV dataset for a zero-configuration demo
- React + TypeScript + Vite + Tailwind CSS + Recharts

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The production bundle is generated in `dist/`.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Deploy.

No environment variables are required for the included demo dataset.

## Dataset

The demo transactions are embedded in `src/Dashboard.tsx` in `EMBEDDED_CSV_DATA`. Replace the rows between the template-literal backticks to use another CSV dataset. Keep the header names consistent with the fields used by the dashboard.

> Note: this is a front-end demo dashboard. Data embedded in source code is public to anyone who can access the deployed site. Do not place confidential customer or business data in the repository.
