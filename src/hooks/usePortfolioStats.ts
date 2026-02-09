import { useMemo, useState, useEffect } from "react";
import { NAVDataPoint, ChartDataPoint, DateRange } from "../types";
import { prepareChartData } from "../utils/calculations";
import { parseDate } from "../utils/dateUtils";
import { ExcelMetadata } from "../utils/excelParser";

interface UsePortfolioStatsReturn {
  chartData: ChartDataPoint[];
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  resetDateRange: () => void;
}

export const usePortfolioStats = (
  portfolioData: NAVDataPoint[],
  metadata?: ExcelMetadata | null,
): UsePortfolioStatsReturn => {
  const defaultDateRange: DateRange = useMemo(() => {
    // Use metadata dates if available (Start Date and End Date from Excel)
    if (metadata?.startDate && metadata?.endDate) {
      const startDateParsed = parseDate(metadata.startDate);
      const endDateParsed = parseDate(metadata.endDate);
      
      if (startDateParsed && endDateParsed) {
        const fromDate = new Date(
          startDateParsed.getFullYear(),
          startDateParsed.getMonth(),
          startDateParsed.getDate()
        );
        const toDate = new Date(
          endDateParsed.getFullYear(),
          endDateParsed.getMonth(),
          endDateParsed.getDate()
        );
        return { from: fromDate, to: toDate };
      }
    }
    
    // Fallback to data dates if metadata not available
    if (portfolioData.length === 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return { from: today, to: today };
    }
    // Get the first date (oldest)
    const firstDate = portfolioData[0].date;
    const fromDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
    
    // Get the last date (newest) - should be April 24, 2024
    const lastDate = portfolioData[portfolioData.length - 1].date;
    const toDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
    
    return {
      from: fromDate,
      to: toDate,
    };
  }, [portfolioData, metadata]);

  const [dateRange, setDateRangeState] = useState<DateRange>(defaultDateRange);

  // Update date range when data or metadata changes
  useEffect(() => {
    // Use metadata dates if available
    if (metadata?.startDate && metadata?.endDate) {
      const startDateParsed = parseDate(metadata.startDate);
      const endDateParsed = parseDate(metadata.endDate);
      
      if (startDateParsed && endDateParsed) {
        const fromDate = new Date(
          startDateParsed.getFullYear(),
          startDateParsed.getMonth(),
          startDateParsed.getDate()
        );
        const toDate = new Date(
          endDateParsed.getFullYear(),
          endDateParsed.getMonth(),
          endDateParsed.getDate()
        );
        setDateRangeState({ from: fromDate, to: toDate });
        return;
      }
    }
    
    // Fallback to data dates
    if (portfolioData.length > 0) {
      const firstDate = portfolioData[0].date;
      const fromDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
      
      const lastDate = portfolioData[portfolioData.length - 1].date;
      const toDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
      
      setDateRangeState({
        from: fromDate,
        to: toDate,
      });
    }
  }, [portfolioData, metadata]);

  const chartData = useMemo(() => {
    if (portfolioData.length === 0) {
      return [];
    }
    return prepareChartData(portfolioData, dateRange.from, dateRange.to);
  }, [portfolioData, dateRange]);

  const setDateRange = (range: DateRange) => {
    setDateRangeState(range);
  };

  const resetDateRange = () => {
    // Use metadata dates if available
    if (metadata?.startDate && metadata?.endDate) {
      const startDateParsed = parseDate(metadata.startDate);
      const endDateParsed = parseDate(metadata.endDate);
      
      if (startDateParsed && endDateParsed) {
        const fromDate = new Date(
          startDateParsed.getFullYear(),
          startDateParsed.getMonth(),
          startDateParsed.getDate()
        );
        const toDate = new Date(
          endDateParsed.getFullYear(),
          endDateParsed.getMonth(),
          endDateParsed.getDate()
        );
        setDateRangeState({ from: fromDate, to: toDate });
        return;
      }
    }
    
    // Fallback to data dates
    if (portfolioData.length > 0) {
      const firstDate = portfolioData[0].date;
      const fromDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
      
      const lastDate = portfolioData[portfolioData.length - 1].date;
      const toDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
      
      setDateRangeState({
        from: fromDate,
        to: toDate,
      });
    }
  };

  return {
    chartData,
    dateRange,
    setDateRange,
    resetDateRange,
  };
};
