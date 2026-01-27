import type { Locator, Page } from '@playwright/test';
import { commonUtils } from './commonUtils';

export class TableUtils extends commonUtils {
    /**
     * Retrieves all column header texts from a table.
     *
     * If headers are not found or any error occurs, an empty array is returned.
     *
     * @param table - Locator pointing to the table element
     * @param headerExpression - Selector used to locate header cells
     *                          (default: 'tr th')
     *
     * @returns Promise<string[]> - An array of table header names in display order.
     */
    static async getTableHeaders(table: Locator, headerExpression: string = 'tr th'):
        Promise<string[]> {
        try {
            const headers = table.locator(headerExpression);
            await headers.first().waitFor({ state: 'visible', timeout: 5000 });

            const count = await headers.count();
            const results: string[] = [];

            for (let i = 0; i < count; i++) {
                const header = headers.nth(i);
                results.push((await header.innerText()).trim());
            }
            
            return results;
        } catch {
            return [];
        }
    }

    /**
     * Returns the zero-based index of a column based on the column header name.
     *  
     * If the column header is not found or an error occurs, `-1` is returned.
     * @param table - Locator pointing to the table element
     * @param columnName - Visible header text to search for
     * @param headerExpression - Selector used to locate header cells
     *                           (default: 'tr th')
     *
     * @returns Promise<number> - Zero-based column index if found, otherwise -1
     */
    static async getColumnIndex(table: Locator, columnName: string,
        headerExpression: string = 'tr th'): Promise<number> {
        try {
            const headers = table.locator(headerExpression);
            await headers.first().waitFor({ state: 'visible', timeout: 5000 });

            const count = await headers.count();

            for (let i = 0; i < count; i++) {
                const header = headers.nth(i);

                const headerText = (await header.innerText()).trim();

                if (headerText === columnName.trim()) {
                    return i;
                }
            }

            return -1;
        } catch (error) {
            return -1;
        }
    }

    /**
     ** Retrieves all cell values from a specific column of a table using
     * a zero-based column index.
     * 
     * * If the column index is invalid (< 0), or if an error occurs,
     * an empty array is returned.
     *
     * @param table - Locator pointing to the table element
     * @param columnIndex - Zero-based index of the column
     * @param rowLocator - Selector for table rows (default: '//tr[contains(@class,"row")]')
     * @param cellLocator - Selector for cells inside a row (default: 'td')
     *
     * @returns Promise<string[]> - Array of cell values from the specified column
     *
     */
    static async getColumnValuesByIndex(table: Locator, columnIndex: number, rowLocator: string = '//tr[contains(@class,"row")]',
        cellLocator: string = 'td'): Promise<string[]> {
        const values: string[] = [];
        if (columnIndex < 0) return values;

        try {
            const rows = table.locator(rowLocator);
            await rows.first().waitFor({ state: 'visible', timeout: 5000 });

            const rowCount = await rows.count();

            for (let i = 0; i < rowCount; i++) {
                const row = rows.nth(i);
                const cells = row.locator(cellLocator);

                if (await cells.count() <= columnIndex) continue;

                const cell = cells.nth(columnIndex);

                const value = (await cell.innerText()).trim();

                values.push(value);
            }
        } catch {
            return [];
        }

        return values;
    }

    /**
     * Returns all cell values from a table for the given column header.
     *
     * @param table table locator
     * @param columnName Exact column header text
     * @param headerLocator Locator for headers (default: tr th)
     * @param rowLocator Locator for rows (default: //tr[contains(@class,"row")])
     * @param cellLocator Locator for cells (default: td)
     * @returns Array of column values
     */
    static async getColumnValuesByHeader(table: Locator, columnName: string, headerLocator: string = 'tr th',
        rowLocator: string = '//tr[contains(@class,"row")]', cellLocator: string = 'td'): Promise<string[]> {

        const columnIndex = await this.getColumnIndex(table, columnName, headerLocator);

        if (columnIndex === -1) {
            console.error(`Column header not found: "${columnName}"`);
        }

        return await this.getColumnValuesByIndex(table, columnIndex, rowLocator, cellLocator);
    }

    /**
    * Returns cell value from a table based on row index and column index
    *
    * @param table - Table locator
    * @param rowIndex - Row index (1-based)
    * @param columnIndex - Column index (0-based)
    * @param rowLocator - Locator for table rows (default: '//tr[contains(@class,"row")]')
    * @param cellLocator - Locator for cells inside a row (default: 'td')
    * @returns Cell text value or empty string if fails
    */
    static async getCellValueByIndex(table: Locator, rowIndex: number, columnIndex: number,
        rowLocator: string = '//tr[contains(@class,"row")]', cellLocator: string = 'td'
    ): Promise<string> {
        try {
            if (rowIndex < 1) {
                console.error(`Row index must be >= 1. Received: ${rowIndex}`);
                return '';
            }

            if (columnIndex < 0) {
                console.error(`Column index must be >= 0. Received: ${columnIndex}`);
                return '';
            }

            const rows = table.locator(rowLocator);
            await rows.first().waitFor({ state: 'visible', timeout: 5000 });

            const rowCount = await rows.count();
            if (rowIndex > rowCount) {
                console.error(`Row index ${rowIndex} exceeds total rows ${rowCount}`);
                return '';
            }

            const row = rows.nth(rowIndex - 1);
            const cells = row.locator(cellLocator);

            const cellCount = await cells.count();
            if (columnIndex >= cellCount) {
                console.error(`Column index ${columnIndex} exceeds total columns ${cellCount}`);
                return '';
            }

            const cell = cells.nth(columnIndex);
            const value = (await cell.innerText()).trim();

            return value;
        } catch (error) {
            console.error(`Failed to get cell value at row ${rowIndex}, column ${columnIndex}: ${(error as Error).message}`);
            return '';
        }
    }


    /**
    * Clicks a table row based on its row index (1-based).
    *
    * The row index is **1-based** for ease of use:
    * - 1 → first row
    * - 2 → second row
    *
    * If the index is invalid or out of range, an error is logged
    * and the action is safely skipped.
    * 
    * @param page - Playwright Page object
    * @param table - Locator pointing to the table element
    * @param rowLocator - Selector used to locate rows
    *                         (default: '//tr[contains(@class,"row")]')
    * @param rowIndex - row index to be click on.
    */
    static async clickOnTableRowByIndex(page: Page, table: Locator, rowLocator: string = '//tr[contains(@class,"row")]', rowIndex: number) {
        try {
            if (rowIndex < 1) {
                console.error(`Row index must be >= 1. Received: ${rowIndex}`);
                return;
            }
            const rows = table.locator(rowLocator);
            await rows.first().waitFor({ state: 'visible', timeout: 15000 });

            const rowCount = await rows.count();

            if (rowIndex > rowCount) {
                console.error(
                    `Row index ${rowIndex} is out of range. Total rows available: ${rowCount}`
                );
                return;
            }
            const row = rows.nth(rowIndex - 1);
            await this.click(page, row);

        } catch (error) {
            console.error(
                `Failed to click table row at index ${rowIndex}: ${(error as Error).message}`
            );
        }
    }

    /**
    * Clicks the first table row that contains the specified text value.
    *
    * If the value is empty, rows are not found, or no matching row exists,
    * an error is logged and execution continues without failure.
    *
    * @param page - Playwright Page object
    * @param table - Locator pointing to the table element
    * @param rowLocator - Selector used to locate rows
    *                         (default: '//tr[contains(@class,"row")]')
    * @param value - Text value to search for within table rows
    *
    */
    static async clickOnTableRowByValue(page: Page, table: Locator, rowLocator: string = '//tr[contains(@class,"row")]', value: string
    ): Promise<void> {
        try {
            if (!value || value.trim() === '') {
                console.error('Search value must be a non-empty string');
                return;
            }

            const rows = table.locator(rowLocator);
            await rows.first().waitFor({ state: 'visible', timeout: 15000 });

            const rowCount = await rows.count();
            if (rowCount === 0) {
                console.error('No rows found in the table');
                return;
            }

            for (let i = 0; i < rowCount; i++) {
                const row = rows.nth(i);
                const rowText = (await row.innerText())
                    .replace(/\s+/g, ' ')
                    .trim();

                if (rowText.toLowerCase().includes(value.toLowerCase())) {
                    await this.click(page, row);
                    return;
                }
            }
            console.error(`Row containing value '${value}' not found`);
        } catch (error) {
            console.error(
                `Failed to click table row by value '${value}': ${(error as Error).message}`
            );
        }
    }

    /**
    * Clicks a table column header based on the given column name.
    *
    * If the column header is not found or any error occurs,
    * the issue is logged.
    *
    * @param page - Playwright Page object
    * @param table - Locator pointing to the table element
    * @param columnName - Visible column header name to click
    * @param headerLocator - Locator expression for table headers
    *                        (default: 'tr th')
    */
    static async clickOnTableColumnHeader(page: Page, table: Locator, columnName: string, headerLocator: string = 'tr th'
    ): Promise<void> {
        try {
            if (!columnName || columnName.trim() === '') {
                console.error('Column name must be a non-empty string');
                return;
            }

            const headers = table.locator(headerLocator);
            await headers.first().waitFor({ state: 'visible', timeout: 10000 });

            const count = await headers.count();

            for (let i = 0; i < count; i++) {
                const header = headers.nth(i);
                const text = (await header.innerText())
                    .replace(/\s+/g, ' ')
                    .replace(/\u00A0/g, ' ')
                    .trim();

                if (text.toLowerCase().includes(columnName.toLowerCase())) {
                    await header.scrollIntoViewIfNeeded();
                    await this.click(page, header);
                    return;
                }
            }
            console.error(`Column header '${columnName}' not found`);

        } catch (error) {
            console.error(
                `Failed to click column header '${columnName}': ${(error as Error).message}`
            );
        }
    }
}



