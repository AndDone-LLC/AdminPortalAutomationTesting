import { test, expect ,Page,Locator} from '@playwright/test';
import { TableUtils } from '../src/utils/tableUtils';
import { AssertionUtils } from '../src/utils/assertionUtils'
import {commonUtils} from '../src/utils/commonUtils'
import{ScrollUtils} from '../src/utils/scrollUtils'

test('test Common functions sorting, scrolling', async ({ page }) => {
  await page.goto('https://admin.qat.anddone.com/#/login');
  await page.getByRole('textbox', { name: '*Username' }).click();
  await page.getByRole('textbox', { name: '*Username' }).fill('AdminUser');
  await page.getByRole('textbox', { name: '*Password' }).click();
  await page.getByRole('textbox', { name: '*Password' }).fill('AdminQAT%12345');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForTimeout(3000);
  await expect(page.getByRole('heading', { name: 'Sub-Merchants' })).toBeVisible();
  await expect(page.getByText('Add Sub-Merchant')).toBeVisible();
  await page.getByRole('link', { name: 'Payments' }).click();
  await page.waitForTimeout(3000);
  await expect(page.getByRole('heading', { name: 'Sub-Merchant Payments' })).toBeVisible();

  await page.locator('#rowsPerPageSelect').selectOption('50');
  await page.waitForTimeout(3000);
  
  ScrollUtils.scrollToBottom(page);
  console.log('Is Element in View Port', await ScrollUtils.isElementInViewport(page.locator('#table-footer')));
//   await commonUtils.scrollToElement(page.locator('text=Title_Chair_553'),undefined,'Last Element');
   await page.waitForTimeout(10000);
//    commonUtils.scrollToEdge(page,"bottom");
//    commonUtils.scrollToEdge(page,'bottom');
//   await page.waitForTimeout(10000);
// commonUtils.scrollByDirection(page,'vertical')
//     await page.waitForTimeout(15000);

// commonUtils.scrollByDirection(page,'vertical',undefined,page.getByRole('table'));
// await page.waitForTimeout(15000);
});