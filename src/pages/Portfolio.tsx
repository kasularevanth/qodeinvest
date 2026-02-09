import { memo, useCallback } from 'react';
import { useNAVData } from '../hooks/useNAVData';
import { usePortfolioStats } from '../hooks/usePortfolioStats';
import EquityCurve from '../components/Portfolio/EquityCurve';
import DateRangePicker from '../components/Portfolio/DateRangePicker';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Portfolio = memo(() => {
  const { data, metadata, loading, error } = useNAVData();
  const {
    chartData,
    dateRange,
    setDateRange,
    resetDateRange,
  } = usePortfolioStats(data, metadata);

  const handleFromDateChange = useCallback(
    (date: Date) => {
      setDateRange({ ...dateRange, from: date });
    },
    [dateRange, setDateRange]
  );

  const handleToDateChange = useCallback(
    (date: Date) => {
      setDateRange({ ...dateRange, to: date });
    },
    [dateRange, setDateRange]
  );


  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Heading and Scheme */}
      {metadata && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-text-dark mb-3 text-center">
            {metadata.heading}
          </h1>
          <p className="text-lg text-text-dark mb-4 text-left">
            {metadata.scheme}
          </p>
          {metadata.startDate && metadata.endDate && (
            <div className="flex gap-8 text-base text-text-dark text-left">
              <div>
                <span className="font-semibold">Start Date:</span> {metadata.startDate}
              </div>
              <div>
                <span className="font-semibold">End Date:</span> {metadata.endDate}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Equity Curve */}
      <div>
        <DateRangePicker
          dateRange={dateRange}
          onFromDateChange={handleFromDateChange}
          onToDateChange={handleToDateChange}
          onReset={resetDateRange}
        />
        <EquityCurve
          data={chartData}
          fromDate={dateRange.from}
          toDate={dateRange.to}
          onReset={resetDateRange}
        />
      </div>
    </div>
  );
});

Portfolio.displayName = 'Portfolio';

export default Portfolio;
