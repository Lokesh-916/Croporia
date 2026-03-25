# 🌿 Croporia — Smart Farm Platform

A complete landscape-layout React app for farm management.
Theme colors: #EBF4DD · #90AB8B · #5A7863 · #3B4953

## Quick Start
```bash
npm install
npm start
```
Opens at http://localhost:3000

## Pages
| Page | What's inside |
|------|--------------|
| Dashboard | Weather, KPI metrics, monthly chart, crop revenue, field cards, recent expenses |
| Fields & Plots | Per-field expense/revenue/profit tracking, harvest countdown |
| Yield Tracker | Harvest records, revenue-by-crop chart |
| Farm Diary | Daily log + Reminders side by side in one view |
| Expenses | Transactions list + category doughnut chart |
| Loans | KCC/NABARD/bank loans, repayment progress, EMI calc, reminder button |
| Reports | P&L trend, expense breakdown, crop comparison, field performance |
| Tasks & Reminders | Full task manager with overdue detection and priority sorting |

## Project Structure
```
src/
├── icons/Icons.jsx        ← All SVG icon components (no emojis)
├── components/
│   ├── Layout.jsx         ← Landscape sidebar + topbar shell
│   ├── Modal.jsx          ← Centered dialog modal
│   └── ChartBox.jsx       ← Chart.js wrapper
├── data/
│   ├── constants.js       ← Crops, categories, config
│   └── demo.js            ← Seed data
├── hooks/useStore.js      ← State management (swap for API)
├── pages/                 ← One file per page
├── utils/helpers.js       ← fmt, sum, calcEMI, dates
├── App.jsx                ← Page router
└── index.css              ← Full design system
```

## Merging into Antigravity
1. `useStore.js` — replace sessionStorage with your API calls
2. Weather in `Layout.jsx` topbar — swap with OpenWeatherMap
3. Each page is a self-contained component — split into your own routing
