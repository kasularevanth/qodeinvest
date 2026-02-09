import { NAVDataPoint, TrailingReturns, ChartDataPoint } from "../types";
import {
  subDays,
  subWeeks,
  subMonths,
  subYears,
  startOfYear,
  differenceInDays,
  differenceInYears,
} from "date-fns";

export const calculateTrailingReturns = (
  data: NAVDataPoint[],
  benchmarkData: NAVDataPoint[],
  currentDate: Date = new Date(),
): { focused: TrailingReturns; nifty50: TrailingReturns } => {
  if (data.length === 0) {
    return {
      focused: createEmptyReturns("Focused"),
      nifty50: createEmptyReturns("NIFTY50"),
    };
  }

  const latestNav = data[data.length - 1].nav;
  const latestDate = data[data.length - 1].date;
  const startNav = data[0].nav;
  const startDate = data[0].date;

  // Helper function to get NAV at a specific date
  const getNavAtDate = (
    navData: NAVDataPoint[],
    targetDate: Date,
  ): number | null => {
    // Find the closest NAV before or on the target date
    for (let i = navData.length - 1; i >= 0; i--) {
      if (navData[i].date <= targetDate) {
        return navData[i].nav;
      }
    }
    return null;
  };

  // Calculate returns for different periods
  const calculateReturn = (startNav: number | null, endNav: number): number => {
    if (!startNav || startNav === 0) return 0;
    return ((endNav - startNav) / startNav) * 100;
  };

  const annualizeReturn = (returnPercent: number, days: number): number => {
    if (days <= 0) return 0;
    const years = days / 365.25;
    if (years <= 0) return returnPercent;
    return (Math.pow(1 + returnPercent / 100, 1 / years) - 1) * 100;
  };

  // YTD (Year to Date)
  const ytdStart = startOfYear(currentDate);
  const ytdNav = getNavAtDate(data, ytdStart);
  const ytd = calculateReturn(ytdNav, latestNav);

  // 1D (1 Day)
  const oneDayAgo = subDays(latestDate, 1);
  const oneDayNav = getNavAtDate(data, oneDayAgo);
  const oneDay = calculateReturn(oneDayNav, latestNav);

  // 1W (1 Week)
  const oneWeekAgo = subWeeks(latestDate, 1);
  const oneWeekNav = getNavAtDate(data, oneWeekAgo);
  const oneWeek = calculateReturn(oneWeekNav, latestNav);

  // 1M (1 Month)
  const oneMonthAgo = subMonths(latestDate, 1);
  const oneMonthNav = getNavAtDate(data, oneMonthAgo);
  const oneMonth = calculateReturn(oneMonthNav, latestNav);

  // 3M (3 Months)
  const threeMonthsAgo = subMonths(latestDate, 3);
  const threeMonthsNav = getNavAtDate(data, threeMonthsAgo);
  const threeMonths = calculateReturn(threeMonthsNav, latestNav);

  // 6M (6 Months)
  const sixMonthsAgo = subMonths(latestDate, 6);
  const sixMonthsNav = getNavAtDate(data, sixMonthsAgo);
  const sixMonths = calculateReturn(sixMonthsNav, latestNav);

  // 1Y (1 Year) - annualized
  const oneYearAgo = subYears(latestDate, 1);
  const oneYearNav = getNavAtDate(data, oneYearAgo);
  const oneYearReturn = calculateReturn(oneYearNav, latestNav);
  const oneYear = annualizeReturn(
    oneYearReturn,
    differenceInDays(latestDate, oneYearAgo),
  );

  // 3Y (3 Years) - annualized
  const threeYearsAgo = subYears(latestDate, 3);
  const threeYearsNav = getNavAtDate(data, threeYearsAgo);
  const threeYearsReturn = calculateReturn(threeYearsNav, latestNav);
  const threeYears = annualizeReturn(
    threeYearsReturn,
    differenceInDays(latestDate, threeYearsAgo),
  );

  // SI (Since Inception)
  const siReturn = calculateReturn(startNav, latestNav);
  const siDays = differenceInDays(latestDate, startDate);
  const si = siDays > 365.25 ? annualizeReturn(siReturn, siDays) : siReturn;

  // Calculate drawdown
  const { currentDrawdown, maxDrawdown } = calculateDrawdown(data);

  const focused: TrailingReturns = {
    name: "Focused",
    ytd: roundToDecimal(ytd, 1),
    "1d": roundToDecimal(oneDay, 1),
    "1w": roundToDecimal(oneWeek, 1),
    "1m": roundToDecimal(oneMonth, 1),
    "3m": roundToDecimal(threeMonths, 1),
    "6m": roundToDecimal(sixMonths, 1),
    "1y": roundToDecimal(oneYear, 1),
    "3y": roundToDecimal(threeYears, 1),
    si: roundToDecimal(si, 1),
    dd: roundToDecimal(currentDrawdown, 1),
    maxdd: roundToDecimal(maxDrawdown, 1),
  };

  // Calculate benchmark returns (NIFTY50) - using similar logic
  // For now, we'll generate mock benchmark data or use a multiplier
  // In production, you'd have actual benchmark data
  const benchmarkMultiplier = 0.7; // Mock: benchmark typically performs differently
  const nifty50: TrailingReturns = {
    name: "NIFTY50",
    ytd: roundToDecimal(ytd * benchmarkMultiplier, 1),
    "1d": roundToDecimal(oneDay * benchmarkMultiplier, 1),
    "1w": roundToDecimal(oneWeek * benchmarkMultiplier, 1),
    "1m": roundToDecimal(oneMonth * benchmarkMultiplier, 1),
    "3m": roundToDecimal(threeMonths * benchmarkMultiplier, 1),
    "6m": roundToDecimal(sixMonths * benchmarkMultiplier, 1),
    "1y": roundToDecimal(oneYear * benchmarkMultiplier, 1),
    "3y": roundToDecimal(threeYears * benchmarkMultiplier, 1),
    si: roundToDecimal(si * benchmarkMultiplier, 1),
    dd: roundToDecimal(currentDrawdown * benchmarkMultiplier, 1),
    maxdd: roundToDecimal(maxDrawdown * benchmarkMultiplier, 1),
  };

  return { focused, nifty50 };
};

const createEmptyReturns = (name: string): TrailingReturns => {
  return {
    name,
    ytd: 0,
    "1d": 0,
    "1w": 0,
    "1m": 0,
    "3m": 0,
    "6m": 0,
    "1y": 0,
    "3y": 0,
    si: 0,
    dd: 0,
    maxdd: 0,
  };
};

export const calculateDrawdown = (
  data: NAVDataPoint[],
): { currentDrawdown: number; maxDrawdown: number; drawdowns: number[] } => {
  if (data.length === 0) {
    return { currentDrawdown: 0, maxDrawdown: 0, drawdowns: [] };
  }

  let peak = data[0].nav;
  let maxDrawdown = 0;
  const drawdowns: number[] = [];

  for (const point of data) {
    if (point.nav > peak) {
      peak = point.nav;
    }
    const drawdown = ((point.nav - peak) / peak) * 100;
    drawdowns.push(drawdown);
    if (drawdown < maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  const currentDrawdown = drawdowns[drawdowns.length - 1] || 0;

  return { currentDrawdown, maxDrawdown, drawdowns };
};

export const generateBenchmarkData = (
  data: NAVDataPoint[],
  startValue: number = 100,
): NAVDataPoint[] => {
  if (data.length === 0) return [];

  // Generate benchmark data with similar but different performance
  const benchmarkData: NAVDataPoint[] = [];
  let currentValue = startValue;
  const avgReturn = (data[data.length - 1].nav / data[0].nav - 1) / data.length;

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      benchmarkData.push({ date: data[i].date, nav: startValue });
    } else {
      // Add some variation to make it realistic
      const daysDiff = differenceInDays(data[i].date, data[i - 1].date);
      const dailyReturn = (avgReturn / data.length) * (daysDiff / 30) * 0.7; // 70% of portfolio return
      const variation = (Math.random() - 0.5) * 0.02; // ±1% random variation
      currentValue = currentValue * (1 + dailyReturn + variation);
      benchmarkData.push({ date: data[i].date, nav: currentValue });
    }
  }

  return benchmarkData;
};

export const prepareChartData = (
  portfolioData: NAVDataPoint[],
  fromDate: Date,
  toDate: Date,
): ChartDataPoint[] => {
  // Filter data by date range - compare dates without time components
  const fromYear = fromDate.getFullYear();
  const fromMonth = fromDate.getMonth();
  const fromDay = fromDate.getDate();
  
  const toYear = toDate.getFullYear();
  const toMonth = toDate.getMonth();
  const toDay = toDate.getDate();
  
  const filteredData = portfolioData.filter((d) => {
    const pointYear = d.date.getFullYear();
    const pointMonth = d.date.getMonth();
    const pointDay = d.date.getDate();
    
    // Compare dates - ensure we include boundary dates
    const pointDate = new Date(pointYear, pointMonth, pointDay).getTime();
    const fromDateTime = new Date(fromYear, fromMonth, fromDay).getTime();
    const toDateTime = new Date(toYear, toMonth, toDay).getTime();
    
    // Include dates that are >= fromDate and <= toDate (inclusive on both ends)
    return pointDate >= fromDateTime && pointDate <= toDateTime;
  });

  if (filteredData.length === 0) {
    return [];
  }

  // Ensure we have data for the exact start and end dates
  // If the first data point is after fromDate, we still include it
  // If the last data point is before toDate, we still include it
  // This ensures the chart shows all available data within the range

  // Calculate drawdown for portfolio
  const { drawdowns } = calculateDrawdown(filteredData);

  // Use actual NAV values (not normalized)
  const chartData: ChartDataPoint[] = [];

  filteredData.forEach((point, index) => {
    chartData.push({
      date: point.date,
      focused: point.nav, // Use actual NAV value
      nifty50: 0, // Not used
      drawdown: drawdowns[index] || 0,
    });
  });

  return chartData;
};

const roundToDecimal = (value: number, decimals: number): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
