import xlsx from 'xlsx';
import { CsvRow, csvRowSchema } from '@shared/schema';

export interface ParsedCsvData {
  rows: CsvRow[];
  errors: string[];
}

/**
 * Parses CSV/XLSX/XLS files and validates the data
 */
export function parseCsvFile(buffer: Buffer, filename: string): ParsedCsvData {
  const errors: string[] = [];
  const rows: CsvRow[] = [];

  try {
    // Read the workbook from buffer
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error('No worksheet found in file');
    }

    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      throw new Error('CSV file is empty');
    }

    // Validate each row
    jsonData.forEach((row: any, index: number) => {
      try {
        // Validate using Zod schema
        const validatedRow = csvRowSchema.parse(row);
        rows.push(validatedRow);
      } catch (error: any) {
        errors.push(`Row ${index + 2}: ${error.message}`);
      }
    });

    // Check if required columns exist in the first row
    const firstRow = jsonData[0] as any;
    if (!firstRow.hasOwnProperty('FirstName')) {
      errors.push('Missing required column: FirstName');
    }
    if (!firstRow.hasOwnProperty('Phone')) {
      errors.push('Missing required column: Phone');
    }

  } catch (error: any) {
    errors.push(`File parsing error: ${error.message}`);
  }

  return { rows, errors };
}

/**
 * Distributes items equally among agents
 * @param items - Array of items to distribute
 * @param agentIds - Array of agent IDs
 * @returns Map of agentId to their assigned items
 */
export function distributeItems<T>(items: T[], agentIds: string[]): Map<string, T[]> {
  const distribution = new Map<string, T[]>();
  
  if (agentIds.length === 0) {
    throw new Error('No agents available for distribution');
  }

  // Initialize empty arrays for each agent
  agentIds.forEach(agentId => {
    distribution.set(agentId, []);
  });

  // Calculate items per agent
  const itemsPerAgent = Math.floor(items.length / agentIds.length);
  const remainder = items.length % agentIds.length;

  let currentIndex = 0;

  // Distribute base amount to each agent
  agentIds.forEach((agentId, agentIndex) => {
    const itemCount = itemsPerAgent + (agentIndex < remainder ? 1 : 0);
    const agentItems = items.slice(currentIndex, currentIndex + itemCount);
    distribution.set(agentId, agentItems);
    currentIndex += itemCount;
  });

  return distribution;
}
