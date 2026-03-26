import dotenv from 'dotenv';
import { config } from '../src/config/config';
dotenv.config();
import { test, expect } from '@playwright/test';
import { AdminPage } from '../src/pages/AdminLoginPage';
import { commonUtils } from "@siddheshwar.anajekar/common-base";
import { AdminHomePage } from '../src/pages/AdminHomePage';
import { AdminEditMerchantPage } from '../src/pages/AdminEditMerchantPage';
import { CoveragePage } from '../src/pages/CoveragePage';

// Helper to get env-specific credentials
const getEnvCredentials = () => {
  const env = process.env.TEST_ENV || 'QAT';
  if (env === 'UAT') {
    return {
      url: process.env.UAT_URL,
      username: process.env.UAT_USERNAME,
      password: process.env.UAT_PASSWORD,
    };
  }
  return {
    url: process.env.QAT_URL,
    username: process.env.QAT_USERNAME,
    password: process.env.QAT_PASSWORD,
  };
};

test('Data sync :Verify validation message for access and permission setting disable ',async({page})=>
{
     test.setTimeout(120000);
  const adminPage = new AdminPage(page);

  const { url, username, password } = getEnvCredentials();
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  });
  await adminPage.login(username, password);
  const adminHomePage = new AdminHomePage(page);
  await adminHomePage.searchByDBAAndValidate(getEnv('MERCHANT_DBA_NAME'));
  await adminHomePage.openActionDropdownAndValidate();
  await adminHomePage.clickEditSubMerchantDetails();
  const editMerchantPage = new AdminEditMerchantPage(page);
  await editMerchantPage.goToDataSynchronization();
  await editMerchantPage.handleNoResultsAndSyncIfNeeded();
  await editMerchantPage.verifyAccessAndPermissionDisableToastMsgDisplay();

  //verify for carrier 
  await editMerchantPage.carrierTabButton.click();
  await editMerchantPage.handleNoResultsAndSyncIfNeeded();
  await editMerchantPage.verifyAccessAndPermissionDisableToastMsgDisplay();
  await editMerchantPage.waitForToastMessageToDisappear();


  //verify for coverage
  await editMerchantPage.coverageTabButton.click();
  await editMerchantPage.handleNoResultsAndSyncIfNeeded();
  await editMerchantPage.verifyAccessAndPermissionDisableToastMsgDisplay();
  await editMerchantPage.waitForToastMessageToDisappear();

  //verify for broker
  await editMerchantPage.brokerTabButton.click(); 
  await editMerchantPage.handleNoResultsAndSyncIfNeeded();
  await editMerchantPage.verifyAccessAndPermissionDisableToastMsgDisplay();
  await editMerchantPage.waitForToastMessageToDisappear();
  
  //verify for GA
  await editMerchantPage.GATabButton.click();
  await editMerchantPage.handleNoResultsAndSyncIfNeeded();
  await editMerchantPage.verifyAccessAndPermissionDisableToastMsgDisplay();
});