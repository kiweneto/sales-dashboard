# Sales Data Dashboard

A web app for recording sales and turning them into running totals and a simple visual report. It grew out of a Python script I wrote to track and record sales data automatically, rebuilt here as something you can actually click around in.

## Why I built it

The Python version did its job, but it lived in a terminal and only I could read it. I wanted the same idea in a form anyone could open in a browser: type in a sale, and watch the totals and the chart update straight away. No spreadsheets, no setup.

## What it does

- Record a sale with a product or category, quantity, unit price, and date
- See live totals at the top: total revenue, units sold, number of records, and average per record
- A revenue-by-product bar chart that redraws itself as you add data
- A full table of every record, with the option to delete any row
- Saves to the browser automatically, so your numbers are still there next time

## Built with

- React (with Vite)
- Plain CSS for the layout and the chart, no charting library
- Browser localStorage, so there is no database to manage

## Running it locally

```bash
npm install
npm run dev
```

Then open the local address it prints (usually http://localhost:5173).

To build the production version:

```bash
npm run build
```

The output goes to the `dist` folder, ready to deploy on Netlify, Vercel, or GitHub Pages.

## What I would add next

- Date-range filtering so you can look at a single month
- A second chart for sales over time
- CSV import and export

## About me

Built by Enoch Aderinsola Ogebule, IT support and software developer based in Lagos, Nigeria.
