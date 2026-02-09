import { useState, useEffect } from 'react';
import { NAVDataPoint } from '../types';
import { parseExcelFile, ExcelMetadata } from '../utils/excelParser';

interface UseNAVDataReturn {
  data: NAVDataPoint[];
  metadata: ExcelMetadata | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const EXCEL_FILE_PATH = '/React Assignment Historical NAV Report.xlsx';

export const useNAVData = (): UseNAVDataReturn => {
  const [data, setData] = useState<NAVDataPoint[]>([]);
  const [metadata, setMetadata] = useState<ExcelMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const parsedData = await parseExcelFile(EXCEL_FILE_PATH);
      setData(parsedData.data);
      setMetadata(parsedData.metadata);
    } catch (err) {
      console.error('Error loading NAV data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load NAV data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    metadata,
    loading,
    error,
    refetch: loadData,
  };
};
