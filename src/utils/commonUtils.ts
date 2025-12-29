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

//   
private async highlight(locator: Locator) {
    try {
      const attached = await locator.isVisible({ timeout: 3000 }).catch(() => false);
      if (!attached) return;

      const handle = await locator.elementHandle();
      if (!handle) return;

      // Change (el: HTMLElement) to (el: any) to bypass strict property checking in the browser context
      await this.page.evaluate((el: any) => {
        const orig = el.getAttribute('style') || '';
        
        // Use style.setProperty or direct assignment
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

  async click(locator: Locator, timeout = 15000) {
    await locator.waitFor({ state: 'visible', timeout }).catch(() => {});
    await this.highlight(locator);
    await locator.click({ timeout });
  }

  async fill(locator: Locator, text: string, timeout = 15000) {
    await locator.waitFor({ state: 'visible', timeout }).catch(() => {});
    await this.highlight(locator);
    await locator.fill(text);
  }

  async type(locator: Locator, text: string, timeout = 15000) {
    await locator.waitFor({ state: 'visible', timeout }).catch(() => {});
    await this.highlight(locator);
    await locator.type(text);
  }

  async waitForVisible(locator: Locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async getText(locator: Locator): Promise<string> {
    const text = await locator.textContent().catch(() => '');
    return text ?? '';
  }
}
