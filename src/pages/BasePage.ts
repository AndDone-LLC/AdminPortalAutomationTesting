import type { Page, Locator } from '@playwright/test';

import { commonUtils } from '../utils/commonUtils';

export class BasePage {
  readonly page: Page; // Playwright Page object
  readonly utils: commonUtils;

  readonly itemsPerPageDropdown: Locator;
  readonly itemsPerPageOptions: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.utils = new commonUtils(page);

    this.itemsPerPageDropdown = page.locator('#maxPerPage');
    this.itemsPerPageOptions = page.locator('#maxPerPage option');
    this.tableRows = page.locator('div.table-container table tbody tr');
  }

  async click(locator: Locator) {
    await this.utils.click(locator);
  }

  async fill(locator: Locator, text: string) {
    await this.utils.fill(locator, text);
  }

  async type(locator: Locator, text: string) {
    await this.utils.type(locator, text);
  }

  async waitForVisible(locator: Locator, timeout?: number) {
    await this.utils.waitForVisible(locator, timeout);
  }

  async getText(locator: Locator): Promise<string> {
    return this.utils.getText(locator);
  }

  async navigateTo(url: string) {
    console.log('Navigating to:', url);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  // Items per page selection
  async selectItemsPerPage(count: number) {
    await this.itemsPerPageDropdown.selectOption(count.toString());
    await this.utils.waitForVisible(this.tableRows.first(), 90000);
  }

async getItemsPerPageOptions(): Promise<string[]> {
  await this.itemsPerPageDropdown.click();
  return (await this.itemsPerPageOptions.allTextContents())
    .map(t => t.trim());
}


}
