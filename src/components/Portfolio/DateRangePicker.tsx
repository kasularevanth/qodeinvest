import { memo } from 'react';
import { DateRange } from '../../types';
import { formatDate } from '../../utils/dateUtils';

interface DateRangePickerProps {
  dateRange: DateRange;
  onFromDateChange: (date: Date) => void;
  onToDateChange: (date: Date) => void;
  onReset: () => void;
}

const DateRangePicker = memo(({
  dateRange,
  onFromDateChange,
  onToDateChange,
  onReset,
}: DateRangePickerProps) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <label htmlFor="from-date" className="text-sm font-medium text-text-dark">
          From date:
        </label>
        <input
          id="from-date"
          type="date"
          value={formatDate(dateRange.from)}
          onChange={(e) => {
            const date = new Date(e.target.value);
            if (!isNaN(date.getTime())) {
              onFromDateChange(date);
            }
          }}
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent-green"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="to-date" className="text-sm font-medium text-text-dark">
          To date:
        </label>
        <input
          id="to-date"
          type="date"
          value={formatDate(dateRange.to)}
          onChange={(e) => {
            const date = new Date(e.target.value);
            if (!isNaN(date.getTime())) {
              onToDateChange(date);
            }
          }}
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent-green"
        />
      </div>
    </div>
  );
});

DateRangePicker.displayName = 'DateRangePicker';

export default DateRangePicker;
