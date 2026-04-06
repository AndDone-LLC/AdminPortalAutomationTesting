
import { test } from '@playwright/test';
import { config } from '../src/config/config';
import { AdminPage } from '../src/pages/AdminLoginPage';
import { AdminHomePage1 } from '../src/pages/AdminHomePage1';
import { SubMerchantDetailsPage1 } from '../src/pages/SubMerchantDetailsPage1';

test('End to End Merchant Onboarding (new files)', async ({ page }) => {
  test.setTimeout(120_000);

  const adminPage = new AdminPage(page);

  await page.goto(`${config.baseUrl}/login`, { waitUntil: 'domcontentloaded' });
  await adminPage.login('shubhamtest1', '0987654321@Core');

  const adminHomePage = new AdminHomePage1(page);

  // Click "Add Sub-Merchant" and wait until "Create New Merchant" is visible
  const subMerchantDetailsPage: SubMerchantDetailsPage1 = await adminHomePage.openAddSubMerchant();

  // One-call flow to create a merchant (includes click on "Create New Merchant")
  await subMerchantDetailsPage.createNewMerchant(
    'Core',
    'Test Company',
    'Test Admin',
    'Test First',
    'Test Last',
    '1234567890',
    'test@example.com',
    '123 Test Street',
    'Test City',
    'PA-Pennsylvania',
    '12345',
    'United States'
  );

  // Optionally add a success assertion here (toast, heading, or URL)
  // await expect(page.getByRole('heading', { name: /onboarding complete/i })).toBeVisible();
});
