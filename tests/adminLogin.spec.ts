import { test, expect } from '@playwright/test';
import { AdminPage } from '../src/pages/AdminLoginPage';
import { commonUtils } from "@siddheshwar.anajekar/common-base";
import { AdminHomePage } from '../src/pages/AdminHomePage';
import { AdminEditMerchantPage } from '../src/pages/AdminEditMerchantPage';
import { CoveragePage } from '../src/pages/CoveragePage';

// test('Admin should login successfully', async ({ page }) => {
//   test.setTimeout(120000);
//   const adminPage = new AdminPage(page);
//   const coveragePage = new CoveragePage(page);
//   const adminEditMerchantPage = new AdminEditMerchantPage(page);

//   await page.goto('https://admin.qat.anddone.com/#/login', {
//     waitUntil: 'domcontentloaded',
//   });

//   await adminPage.login('AdminTejasUser', 'Tejasadmin@1111');

//   // await expect(
//   //   page.getByRole('heading', { name: 'Sub-Merchants' })
//   // ).toBeVisible();
//   // await page.pause();

//   const adminHomePage = new AdminHomePage(page);
//   // await expect(adminHomePage.searchInput).toBeVisible();
//   // await expect(adminHomePage.addSubMerchantBtn).toBeVisible();

//   // await expect(adminHomePage.exportBtn).toBeVisible();
//   // await adminHomePage.exportBtn.click();
//   // await expect(adminHomePage.exportCsvOption).toBeVisible();
//   // await expect(adminHomePage.exportPdfOption).toBeVisible();

//   // await expect(adminHomePage.table).toBeVisible();
//   // await expect(adminHomePage.tableBody).toBeVisible();

//   // await expect(adminHomePage.companyNameHeader).toBeVisible();
//   // await expect(adminHomePage.kycHeader).toBeVisible();
//   // await expect(adminHomePage.kycDeadlineHeader).toBeVisible();
//   // await expect(adminHomePage.dbaNameHeader).toBeVisible();
//   // await expect(adminHomePage.merchantIdHeader).toBeVisible();
//   // await expect(adminHomePage.adminNameHeader).toBeVisible();
//   // await expect(adminHomePage.adminEmailHeader).toBeVisible();
//   // await expect(adminHomePage.createdOnHeader).toBeVisible();
//   // await expect(adminHomePage.allyHeader).toBeVisible();
//   // await expect(adminHomePage.statusHeader).toBeVisible();

//   await adminHomePage.searchByDBAAndValidate('tejasmerchant3');
//   // await adminHomePage.searchByDBAAndValidate('TejasRamane');
//   await adminHomePage.openActionDropdownAndValidate();
//   await adminHomePage.logSearchResults();
//   await adminHomePage.clickEditSubMerchantDetails();

//   const editMerchantPage = new AdminEditMerchantPage(page);

//   await editMerchantPage.goToDataSynchronization();
//   //await editMerchantPage.verifyNoDataSynchronizationResults();
//   await editMerchantPage.handleNoResultsAndSyncIfNeeded();

//   await editMerchantPage.printDataSynchronizationState();

//   // const programData = await editMerchantPage.getAllProgramData();
//   // console.log(JSON.stringify(programData), null, 2);

//   const coverageData = await coveragePage.getAllCoverageData();
//   console.log( JSON.stringify(coverageData), null, 2);

//   // await page.pause();
//   console.log('working');
// });

test(' Data Sync : Coverage : Table Filter Check',async ({ page }) => {
      
});

test('Data sync :Verify validation message for access and permission setting disable ',async({page})=>
{
     test.setTimeout(120000);
  const adminPage = new AdminPage(page);

  await page.goto('https://admin.qat.anddone.com/#/login', {
    waitUntil: 'domcontentloaded',
  });

  await adminPage.login('AdminTejasUser', 'Tejasadmin@1111');
  const adminHomePage = new AdminHomePage(page);
  await adminHomePage.searchByDBAAndValidate('PFTADToggleOFFCN');
  await adminHomePage.openActionDropdownAndValidate();
  await adminHomePage.clickEditSubMerchantDetails();
  const editMerchantPage = new AdminEditMerchantPage(page);
  await editMerchantPage.goToDataSynchronization();
  await editMerchantPage.handleNoResultsAndSyncIfNeeded();
  await editMerchantPage.verifyAccessAndPermissionDisableToastMsgDisplay();
});