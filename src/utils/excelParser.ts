import * as XLSX from "xlsx";
import { NAVDataPoint } from "../types";
import { parseDate } from "./dateUtils";

export interface ExcelMetadata {
  heading: string;
  scheme: string;
  startDate: string;
  endDate: string;
}

export interface ParsedExcelData {
  metadata: ExcelMetadata;
  data: NAVDataPoint[];
}

export const parseExcelFile = async (
  filePath: string,
): Promise<ParsedExcelData> => {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    }) as any[][];

    // Extract metadata by searching for specific patterns
    // Search through first 10 rows to find metadata
    let heading = "";
    let scheme = "";
    let startDate = "";
    let endDate = "";
    
    for (let i = 0; i < Math.min(10, jsonData.length); i++) {
      const row = jsonData[i];
      if (!row) continue;
      
      // Check all columns in the row
      for (let j = 0; j < row.length; j++) {
        const cellValue = String(row[j] || "").trim();
        
        // Find heading (contains "Historical Mutual Fund NAV")
        if (cellValue.includes("Historical Mutual Fund NAV") && !heading) {
          heading = cellValue;
        }
        
        // Find scheme (starts with "scheme:-")
        if (cellValue.toLowerCase().startsWith("scheme:-") && !scheme) {
          scheme = cellValue.replace(/^scheme:-\s*/i, "").trim();
        }
        
        // Find start date (starts with "Start Date:-")
        if (cellValue.toLowerCase().includes("start date:-") && !startDate) {
          // Extract just the date part
          const match = cellValue.match(/Start Date:-\s*(\d{2}-\d{2}-\d{4})/i);
          if (match) {
            startDate = match[1];
          } else {
            startDate = cellValue.replace(/^Start Date:-\s*/i, "").trim();
          }
        }
        
        // Find end date (starts with "End Date:-")
        if (cellValue.toLowerCase().includes("end date:-") && !endDate) {
          // Extract just the date part, avoid "NAV Date" header
          const match = cellValue.match(/End Date:-\s*(\d{2}-\d{2}-\d{4})/i);
          if (match) {
            endDate = match[1];
          } else if (!cellValue.includes("NAV Date")) {
            endDate = cellValue.replace(/^End Date:-\s*/i, "").trim();
          }
        }
      }
    }
    
    // Fallback values if not found
    if (!heading) {
      heading = "Historical Mutual Fund NAV of Quant Active Fund Gr";
    }
    if (!scheme) {
      scheme = "Quant Active Fund Gr";
    }
    
    const metadata: ExcelMetadata = {
      heading: heading,
      scheme: scheme,
      startDate: startDate,
      endDate: endDate,
    };

    // Data starts at row 5 (0-indexed), which is row 6 in Excel
    // Row 5 (0-indexed) contains headers: "NAV Date" and "NAV (Rs)"
    const headerRowIndex = 5;
    const navDateColIndex = 0; // Column A
    const navValueColIndex = 1; // Column B

    // Verify header row
    const headerRow = jsonData[headerRowIndex];
    if (!headerRow) {
      throw new Error("Could not find header row in Excel file");
    }

    // Parse data rows starting from row 6 (0-indexed row 6)
    const data: NAVDataPoint[] = [];

    for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      // Check if row exists
      if (!row) continue;
      
      // Check if row has any non-empty cells
      const hasData = row.some((cell: any) => cell !== null && cell !== undefined && cell !== "");
      if (!hasData) continue;

      const dateValue = row[navDateColIndex];
      const navValue = row[navValueColIndex];

      // More lenient check - allow empty strings but check if we have at least a date
      if (!dateValue && dateValue !== 0) {
        continue;
      }
      
      if (navValue === undefined || navValue === null || navValue === "") {
        continue;
      }

      // Parse date - handle DD-MM-YYYY format
      let date: Date | null = null;

      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === "number") {
        // Excel serial date number
        const excelEpoch = new Date(1899, 11, 30);
        const days = dateValue;
        date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
      } else {
        const dateStr = String(dateValue).trim();
        
        // First try direct regex pattern matching for DD-MM-YYYY (most reliable for Excel format)
        // Match patterns like "24-04-2024" or "24/04/2024"
        const dateMatch = dateStr.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
        if (dateMatch) {
          const day = parseInt(dateMatch[1], 10);
          const month = parseInt(dateMatch[2], 10) - 1; // Month is 0-indexed in JavaScript Date
          const year = parseInt(dateMatch[3], 10);
          
          // Create date and validate it matches what we parsed
          date = new Date(year, month, day);
          
          // Validate the parsed date matches our input
          if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
            // Date is valid and matches, use it
          } else {
            // Date doesn't match (e.g., invalid date like 32-13-2024), try other methods
            date = null;
          }
        }
        
        // If regex didn't work, try parseDate function (uses date-fns)
        if (!date) {
          date = parseDate(dateStr);
        }
      }

      if (!date || !isValidDate(date)) {
        continue;
      }

      // Normalize date to start of day to avoid time component issues
      date.setHours(0, 0, 0, 0);

      // Parse NAV value - keep exact decimal precision from Excel
      const navStr = String(navValue).trim();
      const nav = parseFloat(navStr);
      if (isNaN(nav) || nav <= 0) {
        continue;
      }

      // Use exact value from Excel (no rounding)
      data.push({ date, nav });
    }

    // Sort by date (oldest first)
    data.sort((a, b) => a.date.getTime() - b.date.getTime());

    return { metadata, data };
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    throw error;
  }
};

const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};
