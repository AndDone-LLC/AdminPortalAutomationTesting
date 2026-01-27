import type { Page, Locator } from '@playwright/test';

export class commonUtils {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static getEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      console.warn(`Environment variable ${key} is not set`);
      return '';
    }
    return value;
  }

  /**
  * Highlights a UI element on the page for debugging and visual validation.
  */
  private static async highlight(page: Page, locator: Locator) {
    try {
      const attached = await locator.isVisible({ timeout: 3000 }).catch(() => false);
      if (!attached) return;

      const handle = await locator.elementHandle();
      if (!handle) return;

      await page.evaluate((el: any) => {
        const orig = el.getAttribute('style') || '';

        el.style.transition = 'box-shadow 0.95s ease';
        el.style.boxShadow = '0 0 15px 5px rgba(231, 12, 23, 0.9)';

        setTimeout(() => {
          el.style.boxShadow = 'none';
          el.setAttribute('style', orig);
        }, 1000);
      }, handle);
    } catch {
      console.warn('⚠ highlight skipped: page/locator not ready');
    }
  }

  /**
   * Clicks on a web element after waiting for it to become visible.
   * 
   * If the element is not found or the click fails, the error is logged
   * 
   * @param page - Playwright Page object
   * @param locator - Locator of the element to be clicked
   * @param timeout - Maximum wait time in milliseconds (default: 15000)
   */
  static async click(page: Page, locator: Locator, timeout: number = 15000): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      await this.highlight(page, locator);
      await locator.click({ timeout });
    } catch (error) {
      console.warn(`⚠ Click skipped: ${(error as Error).message}`
      );
    }
  }
  /**
   * Attempts to fill text into an input field.
   * If the element is not visible, detached, or the fill action fails,
   * the error is logged and execution continues.
   * 
   * @param page - Playwright Page object
   * @param locator - Locator of the element to be clicked
   * @param timeout - Maximum wait time in milliseconds (default: 15000)
   */
  static async fill(page: Page, locator: Locator, text: string, timeout: number = 15000
  ): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      await this.highlight(page, locator);
      await locator.fill(text);
    } catch (error) {
      console.warn(
        `⚠ Fill skipped for element. Reason: ${(error as Error).message}`
      );
    }
  }

  /**
  * Types text into an input field using keyboard events..
  *
  * If the element is not ready or typing fails, the error is logged
  * and test execution continues.
  * 
  * @param page - Playwright Page object
  * @param locator - Locator of the input or editable element
  * @param text - Text to be typed
  * @param timeout - Maximum wait time in milliseconds (default: 15000)
  *
  */
  static async typeText(page: Page, locator: Locator, text: string, timeout: number = 15000
  ): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      await this.highlight(page, locator);
      await locator.type(text, { delay: 50 });
    } catch (error) {
      console.warn(
        `⚠ Type skipped for element. Reason: ${(error as Error).message}`
      );
    }
  }

  /**
   * Waits for an element to become visible
   * 
   * @param locator - Locator of the element to wait for
   * @param timeout - Maximum wait time in milliseconds (default: 15000)
   * @param description - Readable description used in logs
   * 
   * */
  static async waitForVisible(locator: Locator, timeout: number = 15000, description = 'Element'
  ): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
    } catch (error) {
      console.error(`❌ ${description} not visible after ${timeout}ms`);
    }
  }

  /**
  * This method retrieves visible text from a locator.
  *
  * @param locator - Playwright locator from which text is retrieved
  * @param timeout - Maximum wait time for visibility (default: 10000ms)
  * @param description - Logical name of the element for logging
  *
  * @returns The extracted text or empty string if unavailable
  *
 */
  static async getText(locator: Locator, timeout: number = 10000, description: string = 'Element'
  ): Promise<string> {
    try {
      await locator.waitFor({ state: 'visible', timeout }).catch(() => { });

      const text = await locator.innerText().catch(() => '');

      return text.trim();
    } catch {
      console.warn(`⚠ Unable to get text from ${description}`);
      return '';
    }
  }
  /**
   * Checks if the given list is sorted in ascending order.
   * @param list List of comparable values
   * @returns true if sorted ascending, else false
   */
  static isAscending<T>(list: T[]): boolean {
    try {
      if (!list || list.length <= 1) return true;

      for (let i = 0; i < list.length - 1; i++) {
        if (list[i] > list[i + 1]) return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Checks if the given list is sorted in descending order.
   * @param list List of comparable values
   * @returns true if sorted descending, else false
   */
  static isDescending<T>(list: T[]): boolean {
    try {
      if (!list || list.length <= 1) return true;

      for (let i = 0; i < list.length - 1; i++) {
        if (list[i] < list[i + 1]) return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }


  /**
   * Sorts a list of values in ascending or descending order.
   * @param values Values to sort
   * @param order Sorting order ('asc' or 'desc')
   * @returns Sorted array
   */
  static sortValues(values: any[], order: 'asc' | 'desc'): any[] {

    const sorted = [...values].sort((a, b) => {
      if (a === b) return 0;
      if (a > b) return 1;
      return -1;
    });

    return order === 'asc' ? sorted : sorted.reverse();
  }
  /**
    * Sort date strings from Newest to Oldest using given format.
    * @param dateStrings Date strings from UI
    * @param format Date format (e.g. 'MMM dd, yyyy HH:mm:s')
    * @returns Sorted date strings (Newest first)
    */
  static sortDateNewestToOldest(dateStrings: string[], format: string): string[] {
    if (!dateStrings || dateStrings.length === 0) return [];

    const dates = dateStrings.map(d =>
      this.parseDateGeneric(d.trim(), format)
    );

    dates.sort((a, b) => b.getTime() - a.getTime());

    return dates.map(d => this.formatDateGeneric(d, format));
  }

  /**
   * Sort date strings from Oldest to Newest using given format.
   * @param dateStrings Date strings from UI
   * @param format Date format (e.g. 'MMM dd, yyyy HH:mm:s')
   * @returns Sorted date strings (Oldest first)
   */
  static sortDateOldestToNewest(dateStrings: string[], format: string): string[] {
    if (!dateStrings || dateStrings.length === 0) return [];

    const dates = dateStrings.map(d =>
      this.parseDateGeneric(d.trim(), format)
    );

    dates.sort((a, b) => a.getTime() - b.getTime());

    return dates.map(d => this.formatDateGeneric(d, format));
  }

  /**
    * Month name to month index mapping for parsing 'MMM' format.
    */
  static readonly MONTH_MAP: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3,
    May: 4, Jun: 5, Jul: 6, Aug: 7,
    Sep: 8, Oct: 9, Nov: 10, Dec: 11
  }

  /**
 * Parses a date string into a Date object using a generic format.
 * Supports multiple date tokens like yyyy, MM, MMM, dd, HH, mm, ss.
 * @param dateStr Date string from UI
 * @param format Format of the date string
 * @returns Parsed Date object
 */
  static parseDateGeneric(dateStr: string, format: string): Date {
    const tokenRegex = /(yyyy|MMM|MM|dd|HH|mm|ss|s)/g;
    const formatTokens = format.match(tokenRegex);
    const dateParts = dateStr.match(/\w+/g);

    if (!formatTokens || !dateParts || formatTokens.length !== dateParts.length) {
      throw new Error(`Invalid date or format: ${dateStr}`);
    }

    let year = 1970, month = 0, day = 1;
    let hour = 0, minute = 0, second = 0;

    formatTokens.forEach((token, i) => {
      const value = dateParts[i];
      switch (token) {
        case "yyyy": year = Number(value); break;
        case "MM": month = Number(value) - 1; break;
        case "MMM": month = this.MONTH_MAP[value]; break;
        case "dd": day = Number(value); break;
        case "HH": hour = Number(value); break;
        case "mm": minute = Number(value); break;
        case "s":
        case "ss": second = Number(value); break;
      }
    });

    return new Date(year, month, day, hour, minute, second);
  }

  /**
  * Formats a Date object into a string using the provided format.
  * @param date Date object
  * @param format Desired output format
  * @returns Formatted date string
  */
  static formatDateGeneric(date: Date, format: string): string {
    const pad = (n: number) => n.toString().padStart(2, "0");

    return format
      .replace("yyyy", date.getFullYear().toString())
      .replace("MMM", Object.keys(this.MONTH_MAP)
        .find(k => this.MONTH_MAP[k] === date.getMonth())!)
      .replace("MM", pad(date.getMonth() + 1))
      .replace("dd", pad(date.getDate()))
      .replace("HH", pad(date.getHours()))
      .replace("mm", pad(date.getMinutes()))
      .replace("ss", pad(date.getSeconds()))
      .replace("s", date.getSeconds().toString());
  }
}
