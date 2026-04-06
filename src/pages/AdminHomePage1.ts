
import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { SubMerchantDetailsPage1 } from './SubMerchantDetailsPage1';

export class AdminHomePage1 extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly logo = this.page.locator("//img[contains(@src,'logo-new.png') and @alt='homepage']");

  readonly addSubMerchantBtn =
    this.page.getByRole('button', { name: /add sub-merchant/i }).or(
      this.page.getByText('Add Sub-Merchant', { exact: true })
    );

  async openAddSubMerchant(): Promise<SubMerchantDetailsPage1> {
    const closeModalBtn = this.page.locator(
      'app-find-merchant .close, app-find-merchant [aria-label="Close"], app-find-merchant button.btn-close'
    );

    // Close modal if present
    if (await closeModalBtn.first().isVisible().catch(() => false)) {
      await closeModalBtn.first().click();
      await expect(closeModalBtn.first()).toBeHidden({ timeout: 5000 });
    }

    await expect(this.addSubMerchantBtn).toBeVisible({ timeout: 15000 });
    await expect(this.addSubMerchantBtn).toBeEnabled();

    await this.addSubMerchantBtn.click();

    // 🔐 Wait for a stable, user-visible signal found in the snapshot:
    const merchantDetailsH1 = this.page.getByRole('heading', {
      level: 1,
      name: /merchant details/i,
    });
    await expect(merchantDetailsH1).toBeVisible({ timeout: 15000 });

    const sub = new SubMerchantDetailsPage1(this.page);

    // The “Create New Merchant” control should now be present
    await expect(sub.createNewMerchantButton).toBeVisible({ timeout: 15000 });

    return sub;
  }
}
