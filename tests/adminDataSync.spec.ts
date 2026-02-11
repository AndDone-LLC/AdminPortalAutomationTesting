import { test, expect } from '@playwright/test';
import { AdminPage } from '../src/pages/AdminLoginPage';
import { AdminHomePage } from '../src/pages/AdminHomePage';
import { AdminEditMerchantPage } from '../src/pages/AdminEditMerchantPage';
import { ApiUtils, LoginPayload, LoginRequest, VariableFactory } from 'anddonejs1';
import { LoginResponse } from 'anddonejs1/dist/api/response/login.response';
import { GetProgramsRequest } from '../src/api/request/GetProgramsRequest';
import { GetCoverageRequest } from '../src/api/request/GetCoverageRequests';
import { CoverageValidator } from '../src/validators/CoverageValidator';

test.beforeAll(async () => {
    VariableFactory.setEnvorimentData('qat');
});

// Get Program Data from UI
test('UI Flow - Extract Program Data', async ({ page }) => {

  test.setTimeout(120000);
  const adminPage = new AdminPage(page);
  await page.goto('https://admin.qat.anddone.com/#/login', {
    waitUntil: 'domcontentloaded',
  });
  await adminPage.login('AdminTejasUser', 'Tejasadmin@1111');
  const adminHomePage = new AdminHomePage(page);
  await adminHomePage.searchByDBAAndValidate('tejasmerchant3');
  await adminHomePage.openActionDropdownAndValidate();
  await adminHomePage.clickEditSubMerchantDetails();
  const editMerchantPage = new AdminEditMerchantPage(page);
  await editMerchantPage.goToDataSynchronization();
  await editMerchantPage.handleNoResultsAndSyncIfNeeded();

  const programData = await editMerchantPage.getAllProgramData();
  console.log("UI Program Data:");
  console.log(JSON.stringify(programData, null, 2));
  expect(programData).toBeDefined();
});

// Get Coverage Data from UI
test('UI Flow - Extract Coverage Data', async ({ page }) => {

    test.setTimeout(120000);
    const adminPage = new AdminPage(page);
    await page.goto('https://admin.qat.anddone.com/#/login', {
        waitUntil: 'domcontentloaded',
    });
    await adminPage.login('AdminTejasUser', 'Tejasadmin@1111');
    const adminHomePage = new AdminHomePage(page);
    await adminHomePage.searchByDBAAndValidate('tejasmerchant3');
    await adminHomePage.openActionDropdownAndValidate();
    await adminHomePage.clickEditSubMerchantDetails();
    const editMerchantPage = new AdminEditMerchantPage(page);
    await editMerchantPage.goToDataSynchronization();
    await editMerchantPage.handleNoResultsAndSyncIfNeeded();
    const coverageData = await editMerchantPage.getAllCoverageData();

    console.log("UI Coverage Data:");
    console.log(JSON.stringify(coverageData, null, 2));
    expect(coverageData).toBeDefined()
});

// Get Program Data from API
test('API Flow - Get Programs', async ({ request }) => {

    ApiUtils.setRequest(request);
    const userName = "tejasmerchant3";
    const password = "Tejasmerchant@11";
    const loginPay = LoginPayload.getPayload({ userName, password });
    await ApiUtils.setResponse(
        await LoginRequest.login(loginPay, {
            origin: VariableFactory.getMerchantPortalUrl()
        })
    );
    VariableFactory.setLoginToken(await LoginResponse.getToken());
    const merchantId = await LoginResponse.getResponseValue('merchantId');
    const programsResponse = await GetProgramsRequest.getPrograms(merchantId);
    expect(programsResponse.status()).toBe(200);
    const json = await programsResponse.json();

    console.log("API Programs Response:");
    console.log(JSON.stringify(json, null, 2));
    expect(json.value.records.length).toBeGreaterThan(0);
});

// Get Coverage Data from API
test('API Flow - Get Coverage', async ({ request }) => {
  ApiUtils.setRequest(request);

  const loginPay = LoginPayload.getPayload({
    userName: "tejasmerchant3",
    password: "Tejasmerchant@11"
  });

  await ApiUtils.setResponse(
    await LoginRequest.login(loginPay, {
      origin: VariableFactory.getMerchantPortalUrl()
    })
  );

  VariableFactory.setLoginToken(await LoginResponse.getToken());
  const merchantId = await LoginResponse.getResponseValue('merchantId');
  const coverageResponse = await GetCoverageRequest.getCoverage(merchantId);
  expect(coverageResponse.status()).toBe(200);
  const json = await coverageResponse.json();
  console.log("API Coverage Response:");
  console.log(JSON.stringify(json, null, 2));
  expect(json.value.records.length).toBeGreaterThan(0);
});

// Validate program Data of UI and API
test('Validate Program Data - UI vs API', async ({ page, request }) => {

  test.setTimeout(180000);
  // ---------- UI FLOW ----------
  const adminPage = new AdminPage(page);
  await page.goto('https://admin.qat.anddone.com/#/login', {
    waitUntil: 'domcontentloaded',
  });

  await adminPage.login('AdminTejasUser', 'Tejasadmin@1111');
  const adminHomePage = new AdminHomePage(page);
  await adminHomePage.searchByDBAAndValidate('tejasmerchant3');
  await adminHomePage.openActionDropdownAndValidate();
  await adminHomePage.clickEditSubMerchantDetails();
  const editMerchantPage = new AdminEditMerchantPage(page);
  await editMerchantPage.goToDataSynchronization();
  await editMerchantPage.handleNoResultsAndSyncIfNeeded();

  const uiProgramData = await editMerchantPage.getAllProgramData();
  // ---------- API FLOW ----------

  ApiUtils.setRequest(request);
  const loginPay = LoginPayload.getPayload({
    userName: "tejasmerchant3",
    password: "Tejasmerchant@11"
  });

  await ApiUtils.setResponse(
    await LoginRequest.login(loginPay, {
      origin: VariableFactory.getMerchantPortalUrl()
    })
  );

  VariableFactory.setLoginToken(await LoginResponse.getToken());
  const merchantId = await LoginResponse.getResponseValue('merchantId');
  const programResponse = await GetProgramsRequest.getPrograms(merchantId);
  expect(programResponse.status()).toBe(200);
  const apiProgramData = await programResponse.json();

  // ---------- VALIDATION ----------
  const mismatches = CoverageValidator.comparePrograms(
    apiProgramData,
    uiProgramData
  );

  console.log("Program Validation Result:", mismatches);
  expect(mismatches.length).toBe(0);
});

// Validate coverage Data of UI and API
test('Validate Coverage Data - UI vs API', async ({ page, request }) => {
  test.setTimeout(180000);

  // ---------- UI FLOW ----------
  const adminPage = new AdminPage(page);
  await page.goto('https://admin.qat.anddone.com/#/login', {
    waitUntil: 'domcontentloaded',
  });

  await adminPage.login('AdminTejasUser', 'Tejasadmin@1111');
  const adminHomePage = new AdminHomePage(page);
  await adminHomePage.searchByDBAAndValidate('tejasmerchant3');
  await adminHomePage.openActionDropdownAndValidate();
  await adminHomePage.clickEditSubMerchantDetails();
  const editMerchantPage = new AdminEditMerchantPage(page);
  await editMerchantPage.goToDataSynchronization();
  await editMerchantPage.handleNoResultsAndSyncIfNeeded();
  const uiCoverageData = await editMerchantPage.getAllCoverageData();

  // ---------- API FLOW ----------

  ApiUtils.setRequest(request);
  const loginPay = LoginPayload.getPayload({
    userName: "tejasmerchant3",
    password: "Tejasmerchant@11"
  });

  await ApiUtils.setResponse(
    await LoginRequest.login(loginPay, {
      origin: VariableFactory.getMerchantPortalUrl()
    })
  );

  VariableFactory.setLoginToken(await LoginResponse.getToken());
  const merchantId = await LoginResponse.getResponseValue('merchantId');
  const coverageResponse = await GetCoverageRequest.getCoverage(merchantId);
  const apiCoverageData = await coverageResponse.json();

  // ---------- VALIDATION ----------
  const mismatches = CoverageValidator.compareCoverageData(
    apiCoverageData,
    uiCoverageData
  );

  console.log("Coverage Validation Result:", mismatches);
});