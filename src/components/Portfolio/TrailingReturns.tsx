import { memo } from 'react';
import { TrailingReturns } from '../../types';

interface TrailingReturnsProps {
  focused: TrailingReturns;
  nifty50: TrailingReturns;
  onDownload?: () => void;
}

const TrailingReturnsTable = memo(({ focused, nifty50, onDownload }: TrailingReturnsProps) => {
  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const columns = [
    { key: 'name', label: 'NAME' },
    { key: 'ytd', label: 'YTD' },
    { key: '1d', label: '1D' },
    { key: '1w', label: '1W' },
    { key: '1m', label: '1M' },
    { key: '3m', label: '3M' },
    { key: '6m', label: '6M' },
    { key: '1y', label: '1Y' },
    { key: '3y', label: '3Y' },
    { key: 'si', label: 'SI' },
    { key: 'dd', label: 'DD' },
    { key: 'maxdd', label: 'MAXDD' },
  ];

  const getValue = (returns: TrailingReturns, key: string): string => {
    if (key === 'name') return returns.name;
    const value = returns[key as keyof TrailingReturns] as number;
    return formatPercentage(value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-text-dark">Trailing Returns</h2>
        {onDownload && (
          <button
            onClick={onDownload}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            aria-label="Download data"
          >
            <svg
              className="w-5 h-5 text-text-light"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-dark border-b border-gray-200">
                NAME
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-dark border-b border-gray-200">
                YTD
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-dark border-b border-gray-200">
                1D
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-dark border-b border-gray-200">
                1W
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-dark border-b border-gray-200">
                1M
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-dark border-b border-gray-200">
                3M
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-dark border-b border-gray-200">
                6M
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-dark border-b border-gray-200">
                1Y
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-dark border-b border-gray-200">
                3Y
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-dark border-b border-gray-200">
                SI
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-dark border-b border-gray-200">
                DD
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-dark border-b border-gray-200">
                MAXDD
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-sm ${
                    col.key === 'name'
                      ? 'font-medium text-text-dark'
                      : 'text-right text-text-dark'
                  }`}
                >
                  {getValue(focused, col.key)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-sm ${
                    col.key === 'name'
                      ? 'font-medium text-text-dark'
                      : 'text-right text-text-dark'
                  }`}
                >
                  {getValue(nifty50, col.key)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-light mt-4">
        Note: Returns above 1 year are annualised.
      </p>
    </div>
  );
});

TrailingReturnsTable.displayName = 'TrailingReturnsTable';

export default TrailingReturnsTable;
