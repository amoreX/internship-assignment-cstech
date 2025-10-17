import xlsx from 'xlsx';
import { z } from 'zod';

// Schema definitions
const csvRowSchema = z.object({
  FirstName: z.string(),
  Phone: z.string(),
  Notes: z.string().optional(),
});

type CsvRow = z.infer<typeof csvRowSchema>;

interface ParsedCsvData {
  rows: CsvRow[];
  errors: string[];
}

export function parseCsvFile(buffer: Buffer, filename: string): ParsedCsvData {
  const errors: string[] = [];
  const rows: CsvRow[] = [];

  try {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    
    if (!sheetName) {
      throw new Error('No worksheet found in file');
    }

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      throw new Error('CSV file is empty');
    }

    jsonData.forEach((row: any, index: number) => {
      try {
        const validatedRow = csvRowSchema.parse(row);
        rows.push(validatedRow);
      } catch (error: any) {
        errors.push(`Row ${index + 2}: ${error.message}`);
      }
    });

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

export function distributeItems<T>(items: T[], agentIds: string[]): Map<string, T[]> {
  const distribution = new Map<string, T[]>();
  
  if (agentIds.length === 0) {
    throw new Error('No agents available for distribution');
  }

  agentIds.forEach(agentId => {
    distribution.set(agentId, []);
  });

  const itemsPerAgent = Math.floor(items.length / agentIds.length);
  const remainder = items.length % agentIds.length;

  let currentIndex = 0;

  agentIds.forEach((agentId, agentIndex) => {
    const itemCount = itemsPerAgent + (agentIndex < remainder ? 1 : 0);
    const agentItems = items.slice(currentIndex, currentIndex + itemCount);
    distribution.set(agentId, agentItems);
    currentIndex += itemCount;
  });

  return distribution;
}