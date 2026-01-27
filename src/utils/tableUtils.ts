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
    * @returns Locator of the clicked header or null if not found
    */
    static async clickOnTableColumnHeader(page: Page, table: Locator, columnName: string, headerLocator: string = 'tr th'
    ): Promise<Locator | null> {
        try {
            if (!columnName || columnName.trim() === '') {
                console.error('Column name must be a non-empty string');
                return null;
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
                    return header;
                }
            }
            console.error(`Column header '${columnName}' not found`);
            return null;
        } catch (error) {
            console.error(
                `Failed to click column header '${columnName}': ${(error as Error).message}`
            );
            return null;
        }
    }

     /**
     * Clicks a specific table cell using row and column indexes.
     *
     * @param page - Playwright Page instance
     * @param table - Locator for the table element
     * @param rowIndex - 1-based index of the row to click
     * @param columnIndex - 1-based index of the column to click
     * @param rowLocator - Locator for table rows (default: '//tr[contains(@class,"row")]')
     * @param cellLocator - Locator for table cells (default: 'td')
     */
  static async clickTableCell( page: Page, table: Locator, rowIndex: number, columnIndex: number,
    rowLocator: string = '//tr[contains(@class,"row")]',cellLocator: string = 'td'
  ): Promise<void> {
  
    try {
      if (rowIndex < 1 || columnIndex < 1) return;
  
      const row = table.locator(rowLocator).nth(rowIndex - 1);
      const cell = row.locator(cellLocator).nth(columnIndex - 1);
  
      await cell.scrollIntoViewIfNeeded();
      await this.click(page, cell);
  
    } catch (err) {
      console.error(
        `clickTableCell failed at row ${rowIndex}, column ${columnIndex}: ${(err as Error).message}`
      );
    }
  }

  /**
   * Clicks the ellipsis (actions) button in the specified table row.
   *
   * @param page - Playwright Page instance.
   * @param table - Table locator.
   * @param rowIndex - 1-based row index.
   * @param ellipsisLocator - Selector for the ellipsis button.
   * @param rowLocator - Selector for table rows.
   * @returns true if clicked successfully, otherwise false.
   */
  static async clickEllipsisByRowIndex(page: Page, table: Locator, rowIndex: number,
    ellipsisLocator: string = 'button#detailsDropdown',
    rowLocator: string = '//tr[contains(@class,"row")]'
  ): Promise<boolean> {
  
    if (rowIndex < 1) {
      console.error('Row index must be >= 1');
      return false;
    }
    const row = table.locator(rowLocator).nth(rowIndex - 1);
  
    await row.scrollIntoViewIfNeeded();
  
    const ellipsis = row.locator(ellipsisLocator);
  
    if (await ellipsis.count() === 0) {
      console.warn('Ellipsis button not found in the row');
      return false;
    }
  
    await this.click(page, ellipsis.first());
    return true;
  }

  /**
   * Waits for filter options to appear and logs an error if it does not.
   *
   * @param filterPopupBox - Locator for the dropdown element
   * @param columnName - Column name used for error logging
   * @returns True if dropdown is visible, otherwise false
   */
  static async waitForFilterOptions(filterPopupBox: Locator,columnName: string,timeout: number = 5000): 
  Promise<boolean> {
    try {
      await this.waitForVisible(filterPopupBox, timeout, `Dropdown for column '${columnName}'`);
      return true;
    } catch {
      console.error(`Filter Options did not appear for column '${columnName}'`);
      return false;
    }
  }
    /**
     * Opens the row-level ellipsis menu and selects the specified option.
     *
     * @param table - Locator representing the table element
     * @param rowIndex - 1-based index of the target row
     * @param optionText - Visible text of the option to select
     * @param page - Playwright Page instance
     * @param optionsContainer - Optional locator for the dropdown/menu container
     */
    static async clickEllipsisAndSelectOption(page: Page,table: Locator,rowIndex: number,
    optionText: string,
    optionsContainer: string = '.dropdown-menu.show'
  ): Promise<void> {
  
    const clicked = await this.clickEllipsisByRowIndex(page, table, rowIndex);
    if (!clicked) return;
  
    const filterOptions = page.locator(optionsContainer);
    const isVisible = await this.waitForFilterOptions(
      filterOptions,
      `row ${rowIndex}`
    );
  
    if (!isVisible) return;
    const option = filterOptions.locator(`text=${optionText}`);
    await this.click(page, option);
  }
  
  /**
   * Clicks Apply button inside a dropdown container
   *
   * @param page - Playwright Page object
   * @param filterPopupBox - Visible dropdown container locator
   * @param applyButtonLocator - Locator for Apply button (relative, overridable)
   */
  static async clickApplyButton( page: Page, filterPopupBox: Locator,
  applyButtonLocator: string = 'a.filter-button.apply'
  ): Promise<void> {
    const applyButton = filterPopupBox.locator(applyButtonLocator);
  
    try {
      await this.waitForVisible(applyButton, 5000);
      await this.click(page, applyButton);
    } catch (err) {
      console.error('Failed to click Apply button', err);
    }
  }
  /**
   * Clicks the "Clear" button.
   *
   * @param page - Playwright Page instance
   * @param filterPopupBox - Locator for the dropdown menu
   * @param clearButtonLocator - Locator for the Clear button (default: 'a#clearButton')
   */
  static async clickClearButton(page: Page,filterPopupBox: Locator,
     clearButtonLocator: string = 'a#clearButton'
  ): Promise<void> {
    const clearButton = filterPopupBox.locator(clearButtonLocator);
  
    await this.waitForVisible(clearButton, 5000, 'Clear button');
    await this.click(page, clearButton);
  }
  
  /**
   * Opens a table column filter, selects a specified option, and applies the filter.
   *
   * This method is used when a table column has a filter dropdown.
   * It clicks the column header , waits for the filter menu to appear,
   * selects the desired option by visible text, and then clicks Apply.
   *
   * Example use cases:
   * - Click on "Payment Method" and select options like VISA, AMEX, etc.
   * - Click on "Status" and select options like Settled, Voided, Pending, etc.
   * @param page - Playwright Page instance
   * @param table - Locator for the table element
   * @param columnName - Name of the column whose filter should be opened
   * @param statusText - Visible text of the filter option to select
   * @param filterContainer - Locator for the filter popup container (default: '.dropdown-menu.show')
   * @param applyButtonLocator - Locator for the Apply button inside the filterContainer (default: 'a.filter-button.apply')
   */
   static async clickOnColumnHeaderAndSelectOption(page: Page,table: Locator,
    columnName: string,statusText: string,filterContainer: string = '.dropdown-menu.show',
    applyButtonLocator: string = 'a.filter-button.apply'
  ) {
    const headerButton = await TableUtils.clickOnTableColumnHeader(page, table, columnName);
  
    if (!headerButton) return;
    
    const filterPopupBox = page.locator(filterContainer);
  
    const visible = await this.waitForFilterOptions(
      filterPopupBox,
      `column '${columnName}'`
    );
    if (!visible) return;
  
    const statusOption = filterPopupBox.getByText(statusText, { exact: true });
    await this.click(page, statusOption);
  
    await this.clickApplyButton(page, filterPopupBox, applyButtonLocator);
  }
  
   /**
   * Opens the column filter dropdown, enters a value into the input field, and clicks Apply.
   *
   * @param table - Locator for the table element
   * @param columnName - Name of the column whose filter should be opened
   * @param inputValue - Value to enter into the filter input
   * @param page - Playwright Page object
   * @param filterContainer - Locator for the filter popup container (default: '.dropdown-menu.show')
   * @param inputLocator - Locator for the input field inside filterContainer (default: 'input')
   */
   static async clickOnColumnAndEnterInputValue(page: Page,table: Locator,columnName: string,
    inputValue: string,filterContainer: string = '.dropdown-menu.show',
    inputLocator: string = 'input',
  ): Promise<void> {
  
    const headerButton = await this.clickOnTableColumnHeader(page, table, columnName);
  
    if (!headerButton) {
      console.error(`Cannot find column '${columnName}', skipping input filter`);
      return;
    }
  
    const filterPopupBox = page.locator(filterContainer);
    const visible = await this.waitForFilterOptions(
      filterPopupBox,
      `column '${columnName}'`
    );
    if (!visible) return;
  
    const input = filterPopupBox.locator(inputLocator).first();
    if ((await input.count()) === 0) {
      console.error(`No input field found for column '${columnName}'`);
      return;
    }
    await this.fill(page, input, '');
    await this.typeText(page, input, inputValue);
  }
  
  /**
   * Enters the "From" date into the date filter input inside a dropdown.
   *
   * @param page - Playwright Page object
   * @param filterPopupBox - Locator for the filter popup
   * @param fromDate - Date value to enter
   * @param dateInputLocator - Locator for the "From" date input
   */
   static async enterFromDate( page: Page, filterPopupBox: Locator, fromDate: string,
    dateInputLocator: string = 'input#inputFromDate'
  ): Promise<void> {
  
    const fromInput = filterPopupBox.locator(dateInputLocator).first();
    await this.fill(page, fromInput, fromDate);
  }
  /**
   * Enters the "To" date into the date filter input inside a dropdown.
   *
   * @param page - Playwright Page object
   * @param filterPopupBox - Locator for the filter popup
   * @param toDate - Date value to enter
   * @param dateInputLocator - Locator for the "To" date input (default: 'input[type="date"], input[placeholder*="To"]')
   */
  static async enterToDate( page: Page, filterPopupBox: Locator, toDate: string,
     dateInputLocator: string = 'input#inputToDate'
  ): Promise<void> {
  
    const toInput = filterPopupBox.locator(dateInputLocator).first();
    await this.fill(page, toInput, toDate);
  }
  /**
   * Opens the column filter dropdown, enters a date range (From and To), and clicks Apply.
   *
   * @param table - Locator for the table element
   * @param columnName - Name of the column whose date filter should be opened
   * @param fromDate - Start date to enter (format depends on input)
   * @param toDate - End date to enter (format depends on input)
   * @param page - Playwright Page object
   * @param filterContainer - Locator for the filter popup container (default: '.dropdown-menu.show')
   * @param dateInputLocator - Locator for date input fields inside dropdown (default: 'input[type="date"], input[placeholder*="From"], input[placeholder*="To"]')
   * @param applyButtonLocator - Locator for the Apply button inside the dropdown (default: 'button:has-text("Apply"), a:has-text("Apply")')
   */
   static async clickOnColumnAndEnterDate(page: Page,table: Locator, columnName: string, fromDate: string,
    toDate: string,filterContainer: string = '.dropdown-menu.show',dateInputFromLocator: string = '#inputFromDate',
    dateInputToLocator: string = '#inputToDate', applyButtonLocator: string = 'a.filter-button.apply',
  ): Promise<void> {
  
    if (!fromDate || !toDate) {
      console.error('Both fromDate and toDate must be provided');
      return;
    }
  
    const headerButton = await this.clickOnTableColumnHeader(page, table, columnName);
    if (!headerButton) {
      console.error(`Cannot find column '${columnName}', skipping date range filter`);
      return;
    }
  
    const filterPopupBox = page.locator(filterContainer);
  
    await filterPopupBox.waitFor({ state: 'visible', timeout: 5000 });
  
    await this.enterFromDate(page, filterPopupBox, fromDate, dateInputFromLocator);
    await this.enterToDate(page, filterPopupBox, toDate, dateInputToLocator);
  
    await this.clickApplyButton(page, filterPopupBox, applyButtonLocator);
  }
  
    /**
     * Find row and column index of a cell based on its text value.
     *
     * @param table - Table locator
     * @param cellValue - Text to search for
     * @param rowLocator - Locator for table rows (default: 'tbody tr')
     * @param cellLocator - Locator for table cells (default: 'td')
     * @param exactMatch - Whether to match exact text or partial (default: false)
     *
     * @returns Object containing rowIndex and columnIndex (1-based), or null if not found
     */
   static async getCellPositionByValue( table: Locator, cellValue: string, rowLocator: string = '//tr[contains(@class,"row")]',
    cellLocator: string = 'td', exactMatch: boolean = false
  ): Promise<{ rowIndex: number; columnIndex: number } | null> {
  
    const rows = table.locator(rowLocator);
  
    await rows.first().waitFor({ state: 'visible', timeout: 10000 });
  
    const rowCount = await rows.count();
  
    for (let i = 0; i < rowCount; i++) {
      const cells = rows.nth(i).locator(cellLocator);
      const cellCount = await cells.count();
  
      for (let j = 0; j < cellCount; j++) {
        const cell = cells.nth(j);
        const text = (await cell.innerText()).trim();
  
        const isMatch = exactMatch
          ? text === cellValue
          : text.includes(cellValue);
  
        if (isMatch) {
          return {
            rowIndex: i + 1,    
            columnIndex: j + 1  
          };
        }
      }
    }
  
    console.warn(`Cell value "${cellValue}" not found in table`);
    return null;
  }
  /**
   * Finds a cell by column name and row index, then clicks the copy-to-clipboard icon inside it.
   *
   * @param page - Playwright Page instance
   * @param table - Locator for the table element
   * @param columnName - Name of the column containing the target cell
   * @param rowIndex - 1-based row index
   * @param cellLocator - Locator for table cells (default: 'td')
   * @param rowLocator - Locator for table rows (default: 'tbody tr')
   * @param copyIconLocator - Locator for the copy icon inside the cell (default: 'span.copy')
   * @returns True if the copy icon was clicked successfully, otherwise false
   */
  static async clickCopyToClipboardByRowIndex( page: Page, table: Locator,columnName: string, rowIndex: number,
    cellLocator: string = 'td', rowLocator: string = '//tr[contains(@class,"row")]',
    copyIconLocator: string = 'i.bi.bi-files'
  ): Promise<boolean> {
  
    const columnIndex = await this.getColumnIndex(table, columnName);
  
    if (columnIndex === -1) {
      console.error(`Column '${columnName}' not found`);
      return false;
    }
  
    const row = table.locator(rowLocator).nth(rowIndex - 1);
    await row.waitFor({ state: 'visible', timeout: 5000 });
  
    const cell = row.locator(cellLocator).nth(columnIndex);
  
    const copyIcon = cell.locator(copyIconLocator).first();
  
    if (await copyIcon.count() === 0) {
      console.warn('Copy icon not found in target cell');
      return false;
    }
    await copyIcon.scrollIntoViewIfNeeded();
    await this.click(page, copyIcon);
  
    return true;
  }
  

}



