import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';

export class dataReader{
private static resolvePath(fileName: string): string {
    return path.join(process.cwd(), 'test-data', fileName);
  }

static readExcel<T = Record<string, any>>(fileName: string,sheetName?: string): T[]
{
    const filePath = this.resolvePath(fileName);
     const workbook = XLSX.readFile(filePath);
   const targetSheet = sheetName ?? workbook.SheetNames[0];
    if (!targetSheet) 
     throw new Error('No sheet available in workbook and no sheetName provided.');
    const worksheet = workbook.Sheets[targetSheet];
    if (!worksheet) 
     {
    throw new Error(`Sheet "${targetSheet}" not found in Excel file`);
  }
    return XLSX.utils.sheet_to_json(worksheet, { defval: '' });  
}

static readCSV<T = Record<string, string>>(fileName: string, delimiter=','): T[]
{
    const filePath = this.resolvePath(fileName);
   const content = fs.readFileSync(filePath, 'utf-8').trim();
    const lines = content.split('\n');
    if (!lines[0]) {
      throw new Error('CSV file is empty or has no header row.');
    }
    const headers = lines[0].split(delimiter).map(h => h.trim());
    return lines.slice(1).map(line => {
      const values = line.split(delimiter);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() ?? '';
      });
      return row as T;
    });
  }
  
  static readJson<T>(fileName: string): T {
    const filePath = this.resolvePath(fileName);
    const fullPath = path.resolve(filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`JSON file not found: ${fullPath}`);
    }
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as T;
  }

static async readXml<T>(fileName: string): Promise<T> {
    const filePath = this.resolvePath(fileName);
    const fullPath = path.resolve(filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`XML file not found: ${fullPath}`);
    }
    const xml = fs.readFileSync(fullPath, 'utf-8');
    return (await parseStringPromise(xml, {
      explicitArray: false
    })) as T;
  }
}


