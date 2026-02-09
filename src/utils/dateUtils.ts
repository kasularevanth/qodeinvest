import { format, parse, isValid } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

export const parseDate = (dateString: string): Date | null => {
  // Try multiple date formats - prioritize DD-MM-YYYY format
  const formats = [
    'dd-MM-yyyy', // Primary format from Excel
    'dd/MM/yyyy',
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'MM-dd-yyyy',
  ];

  for (const fmt of formats) {
    try {
      const parsed = parse(dateString.trim(), fmt, new Date());
      if (isValid(parsed)) {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  // Try native Date parsing as fallback
  const nativeParsed = new Date(dateString);
  if (isValid(nativeParsed)) {
    return nativeParsed;
  }

  return null;
};

export const validateDateRange = (from: Date, to: Date): boolean => {
  return from <= to;
};

export const getDaysDifference = (from: Date, to: Date): number => {
  const diffTime = Math.abs(to.getTime() - from.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getYearsDifference = (from: Date, to: Date): number => {
  const diffTime = Math.abs(to.getTime() - from.getTime());
  return diffTime / (1000 * 60 * 60 * 24 * 365.25);
};
