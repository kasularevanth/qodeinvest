# Portfolio Management React App

A modern, fast-loading React application for portfolio management with real-time NAV tracking, performance analytics, and interactive charts.

## Features

- **Home Page**: Blog posts display with informational cards
- **Portfolio Page**: 
  - Trailing returns table with multiple time periods
  - Interactive equity curve chart with drawdown visualization
  - Date range filtering
  - CSV export functionality

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - Latest React with concurrent features
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - High-performance React charting library
- **React Router v6** - Client-side routing
- **xlsx** - Excel file parsing
- **date-fns** - Date utilities

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Project Structure

```
qode/
├── public/
│   └── React Assignment Historical NAV Report.xlsx
├── src/
│   ├── components/
│   │   ├── Layout/          # Sidebar and main layout
│   │   ├── Home/            # Home page components
│   │   ├── Portfolio/       # Portfolio page components
│   │   └── common/          # Shared components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── data/                # Mock data
│   ├── pages/               # Page components
│   ├── App.tsx              # Main app component with routing
│   └── main.tsx             # Entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## Key Features Implementation

### Excel Data Parsing
- Automatically parses NAV data from Excel file
- Handles various date formats
- Validates and cleans data

### Performance Calculations
- Trailing returns (YTD, 1D, 1W, 1M, 3M, 6M, 1Y, 3Y, SI)
- Drawdown calculations
- Annualized returns for periods > 1 year
- Benchmark comparison (NIFTY50)

### Charts
- Equity curve visualization
- Drawdown area chart
- Interactive date range filtering
- Responsive design

## Performance Optimizations

- Code splitting with React.lazy()
- Component memoization
- Memoized calculations
- Optimized bundle sizes
- Fast Vite build tool

## Responsive Design

- Mobile-first approach
- Breakpoints: mobile (<768px), tablet (768px-1024px), desktop (>1024px)
- Adaptive layouts for all screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
