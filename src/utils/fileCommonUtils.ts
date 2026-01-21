import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import { parseStringPromise } from "xml2js";
//import pdfParse from 'pdf-parse';
const pdfParse = require("pdf-parse");
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class fileCommonUtils {
  // ================== PATH RESOLVER ==================
  private static resolvePath(fileName: string): string {
    return path.join(process.cwd(), "test-data", fileName);
  }

  // ================== EXCEL ==================
  static readExcel<T = Record<string, any>>(
    fileName: string,
    sheetName?: string,
  ): T[] {
    try {
      const filePath = this.resolvePath(fileName);
      const workbook = XLSX.readFile(filePath);
      const targetSheet = sheetName ?? workbook.SheetNames[0];
      if (!targetSheet) {
        console.error(`No sheets found in ${fileName}`);
        return [];
      }
      const worksheet = workbook.Sheets[targetSheet];
      if (!worksheet) {
        console.error(`Sheet "${targetSheet}" not found`);
        return [];
      }
      return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    } catch (error) {
      console.error(`Failed to read Excel ${fileName}`, error);
      return [];
    }
  }

  static writeExcel(
    fileName: string,
    data: Record<string, any>[],
    sheetName = "Sheet1",
  ): void {
    try {
      const filePath = this.resolvePath(fileName);
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, filePath);
    } catch (error) {
      console.error(`Failed to write Excel ${fileName}`, error);
    }
  }

  static getExcelSheetNames(fileName: string): string[] {
    try {
      const workbook = XLSX.readFile(this.resolvePath(fileName));
      return workbook.SheetNames;
    } catch (error) {
      console.error(`Failed to read sheet names`, error);
      return [];
    }
  }

  // ================== CSV ==================
  static readCSV<T = Record<string, string>>(
    fileName: string,
    delimiter = ",",
  ): T[] {
    try {
      const filePath = this.resolvePath(fileName);
      const content = fs.readFileSync(filePath, "utf-8").trim();
      if (!content) return [];
      const [header, ...rows] = content.split("\n");
      if (!header) return [];
      const headers = header.split(delimiter).map((h) => h.trim());
      return rows.map((row) => {
        const values = row.split(delimiter);
        const record: Record<string, string> = {};
        headers.forEach((h, i) => (record[h] = values[i]?.trim() ?? ""));
        return record as T;
      });
    } catch (error) {
      console.error(`Failed to read CSV ${fileName}`, error);
      return [];
    }
  }

  static writeCSV(
    fileName: string,
    data: Record<string, any>[],
    delimiter = ",",
  ): void {
    try {
      if (!data.length) return;
      const filePath = this.resolvePath(fileName);
      const headers = Object.keys(data[0] ?? {}).join(delimiter);
      const rows = data
        .map((row) => Object.values(row).join(delimiter))
        .join("\n");
      fs.writeFileSync(filePath, `${headers}\n${rows}`);
    } catch (error) {
      console.error(`Failed to write CSV ${fileName}`, error);
    }
  }

  // ================== JSON / XML ==================
  static readJson<T>(fileName: string): T | null {
    try {
      const filePath = this.resolvePath(fileName);
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
    } catch (error) {
      console.error(`Failed to read JSON ${fileName}`, error);
      return null;
    }
  }

  static async readXml<T>(fileName: string): Promise<T | null> {
    try {
      const xml = fs.readFileSync(this.resolvePath(fileName), "utf-8");
      return await parseStringPromise(xml, { explicitArray: false });
    } catch (error) {
      console.error(`Failed to read XML ${fileName}`, error);
      return null;
    }
  }

  // ================== DATA HELPERS ==================
  static getRowCount<T>(data: T[]): number {
    return data.length;
  }

  static getColumnHeaders<T extends Record<string, any>>(data: T[]): string[] {
    return Object.keys(data[0] ?? {});
  }

  static getCellData<T extends Record<string, any>>(
    data: T[],
    row: number,
    column: keyof T,
  ): any {
    return data[row]?.[column];
  }

  static select<T extends Record<string, any>>(
    data: T[],
    column: keyof T,
    value: any,
  ): T[] {
    return data.filter((row) => row[column] === value);
  }

  // ================== FILE UTILS ==================
  static async readTextFile(filePath: string): Promise<string> {
    try {
      return await fs.promises.readFile(path.resolve(filePath), "utf-8");
    } catch (error) {
      console.error(`Failed to read text file ${filePath}`, error);
      return "";
    }
  }

  static async readPdfFile(filePath: string): Promise<string> {
    try {
      const buffer = await fs.promises.readFile(path.resolve(filePath));
      const parsed = await (pdfParse as any)(buffer);
      return parsed.text;
    } catch (error) {
      console.error(`Failed to read PDF ${filePath}`, error);
      return "";
    }
  }

  static async editTextFile(
    filePath: string,
    search: string | RegExp,
    replace = "",
  ): Promise<void> {
    try {
      const content = await this.readTextFile(filePath);
      const updated = content.replace(search, replace);
      await fs.promises.writeFile(path.resolve(filePath), updated, "utf-8");
    } catch (error) {
      console.error(`Failed to edit file ${filePath}`, error);
    }
  }

  // ================== FOLDER UTILS ==================
  static async getFileCount(folderPath: string): Promise<number> {
    try {
      const entries = await fs.promises.readdir(path.resolve(folderPath), {
        withFileTypes: true,
      });
      return entries.filter((e) => e.isFile()).length;
    } catch (error) {
      console.error(`Failed to count files`, error);
      return 0;
    }
  }

  static async getAllFileNames(folderPath: string): Promise<string[]> {
    try {
      const entries = await fs.promises.readdir(path.resolve(folderPath), {
        withFileTypes: true,
      });
      return entries.filter((e) => e.isFile()).map((e) => e.name);
    } catch (error) {
      console.error(`Failed to list files`, error);
      return [];
    }
  }

  // ================== PDF LINK ==================
  static async clickLinkInsidePdf(
    page: any,
    filePath: string,
    index = 0,
  ): Promise<void> {
    const text = await this.readPdfFile(filePath);
    const links = text.match(/https?:\/\/[^\s]+/g) ?? [];
    if (links[index]) await page.goto(links[index]);
    else console.error("No valid link found in PDF");
  }

  // ================== COMMAND ==================
  static async runCommand(
    folderPath: string,
    command: string,
  ): Promise<string> {
    try {
      const { stdout } = await execAsync(command, {
        cwd: path.resolve(folderPath),
      });
      return stdout;
    } catch (error) {
      console.error(`Command execution failed`, error);
      return "";
    }
  }
}
