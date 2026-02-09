import { memo, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartDataPoint } from '../../types';
import { formatDisplayDate } from '../../utils/dateUtils';

interface EquityCurveProps {
  data: ChartDataPoint[];
  fromDate: Date;
  toDate: Date;
  onReset: () => void;
}

const EquityCurve = memo(({ data, fromDate, toDate, onReset }: EquityCurveProps) => {
  const chartData = useMemo(() => {
    return data.map((point) => ({
      date: point.date.getTime(),
      dateLabel: formatDisplayDate(point.date),
      nav: point.focused, // Use actual NAV value from Excel
      drawdown: Math.abs(point.drawdown), // Make drawdown positive for area chart
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-medium text-text-dark mb-2">
            {payload[0]?.payload?.dateLabel}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'drawdown' ? 'Drawdown' : 'NAV'}:{' '}
              {entry.name === 'drawdown'
                ? `${entry.value.toFixed(2)}%`
                : entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatXAxis = (tickItem: number) => {
    const date = new Date(tickItem);
    // Format as "MMM dd, yyyy" (e.g., "Apr 24, 2024")
    return formatDisplayDate(date);
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-text-light">No data available for the selected date range.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-text-dark">Equity curve</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-light">
            Live since {formatDisplayDate(fromDate)}
          </span>
          <button
            onClick={onReset}
            className="text-accent-green hover:underline text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatXAxis}
            stroke="#6b7280"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
            interval="preserveStartEnd"
            minTickGap={50}
            allowDataOverflow={false}
          />
          <YAxis
            yAxisId="equity"
            orientation="left"
            stroke="#6b7280"
            fontSize={12}
            domain={['dataMin - 50', 'dataMax + 50']}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <YAxis
            yAxisId="drawdown"
            orientation="right"
            stroke="#6b7280"
            fontSize={12}
            domain={[0, 'dataMax + 5']}
            tickFormatter={(value) => `-${value.toFixed(0)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            yAxisId="drawdown"
            type="monotone"
            dataKey="drawdown"
            fill="#fca5a5"
            stroke="#fca5a5"
            fillOpacity={0.6}
            name="Drawdown"
          />
          <Line
            yAxisId="equity"
            type="monotone"
            dataKey="nav"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="NAV"
            connectNulls={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
});

EquityCurve.displayName = 'EquityCurve';

export default EquityCurve;
