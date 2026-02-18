import { test, expect } from '@playwright/test';
import { AdminPage } from '../src/pages/AdminLoginPage';
import { AdminHomePage } from '../src/pages/AdminHomePage';
import { AdminEditMerchantPage } from '../src/pages/AdminEditMerchantPage';
import { ApiUtils, LoginPayload, LoginRequest, VariableFactory } from 'anddonejs1';
import { LoginResponse } from 'anddonejs1/dist/api/response/login.response';
import { GetProgramsRequest } from '../src/api/request/GetProgramsRequest';
import { GetCoverageRequest } from '../src/api/request/GetCoverageRequests';
import { CoverageValidator } from '../src/validators/CoverageValidator';
import { BrokerPage } from '../src/pages/BrokerPage';
import { GetBrokerRequest } from '../src/api/request/GetBrokerRequests';

test.beforeAll(async () => {
    VariableFactory.setEnvorimentData('qat');
});

// Get Broker Data from UI
// Handles No Results found
// Performs sync if No Results found occurs
test('(AN-T27295), (AN-T27293), (AN-T27290), (AN-T27289), (AN-T27291) UI Flow - Extract Broker Data, To Handle No Results found, Performs sync if No Results Found Occurs', async ({ page }) => {

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
    const brokerPage = new BrokerPage(page);
    await editMerchantPage.goToDataSynchronization();
    await editMerchantPage.handleNoResultsAndSyncIfNeeded();
    const brokerPageData = await brokerPage.getAllBrokerData();

    console.log("UI Broker Data:");
    console.log(JSON.stringify(brokerPageData, null, 2));
    expect(brokerPageData).toBeDefined()

});

test('(AN-T27297) Check Status column by selcting Active/Inactive', async ({ page }) => {

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
    const brokerPage = new BrokerPage(page);
    await editMerchantPage.goToDataSynchronization();
    await editMerchantPage.handleNoResultsAndSyncIfNeeded();

    console.log("\n--- STATUS FILTER ACTIVE ---");
    await brokerPage.openBrokerTab();
    await brokerPage.table.applyDropdownFilter("Status", "Active");
    await brokerPage.table.verifyAllPagesColumnValue("Status", "Active");
    console.log("✓ Status Active filter working");

    console.log("\n--- STATUS FILTER INACTIVE ---");
    await brokerPage.openBrokerTab();
    await brokerPage.table.applyDropdownFilter("Status", "Inactive");
    await brokerPage.table.verifyAllPagesColumnValue("Status", "Inactive");
    console.log("✓ Status Inactive filter working");

});

test('(AN-T27297) Check Portal Status by clicking on Active/Inactive', async ({ page }) => {

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
    const brokerPage = new BrokerPage(page);
    await editMerchantPage.goToDataSynchronization();
    await editMerchantPage.handleNoResultsAndSyncIfNeeded();

    console.log("\n--- PORTAL STATUS FILTER ACTIVE ---");
    await brokerPage.openBrokerTab();
    await brokerPage.table.applyDropdownFilter("Portal Status", "Active");
    await brokerPage.table.verifyAllPagesColumnValue("Portal Status", "Active");
    console.log("✓ Portal Status Active filter working");

    console.log("\n--- PORTAL STATUS FILTER INACTIVE ---");
    await brokerPage.openBrokerTab();
    await brokerPage.table.applyDropdownFilter("Portal Status", "Inactive");
    await brokerPage.table.verifyAllPagesColumnValue("Portal Status", "Inactive");
    console.log("✓ Portal Status Inactive filter working");

});

// test('(AN-T27297) Check IPFS Mapped by selecting Yes/No', async ({ page }) => {

//     test.setTimeout(120000);
//     const adminPage = new AdminPage(page);
//     await page.goto('https://admin.qat.anddone.com/#/login', {
//         waitUntil: 'domcontentloaded',
//     });
//     await adminPage.login('AdminTejasUser', 'Tejasadmin@1111');
//     const adminHomePage = new AdminHomePage(page);
//     await adminHomePage.searchByDBAAndValidate('tejasmerchant3');
//     await adminHomePage.openActionDropdownAndValidate();
//     await adminHomePage.clickEditSubMerchantDetails();
//     const editMerchantPage = new AdminEditMerchantPage(page);
//     const brokerPage = new BrokerPage(page);
//     await editMerchantPage.goToDataSynchronization();
//     await editMerchantPage.handleNoResultsAndSyncIfNeeded();

//     console.log("\n--- IPFS Mapped FILTER YES ---");
//     await brokerPage.openBrokerTab();
//     await brokerPage.table.applyDropdownFilter("IPFS Mapped", "YES");
//     await brokerPage.table.verifyAllPagesColumnValue("IPFS Mapped", "YES");
//     console.log("✓ IPFS Mapped YES filter working");

//     console.log("\n--- IPFS Mapped FILTER No ---");
//     await brokerPage.openBrokerTab();
//     await brokerPage.table.applyDropdownFilter("IPFS Mapped", "NO");
//     await brokerPage.table.verifyAllPagesColumnValue("IPFS Mapped", "NO");
//     console.log("✓ IPFS Mapped No filter working");

// });

test('(AN-T27297) Check Updated On Filter functionality', async ({ page }) => {

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
    const brokerPage = new BrokerPage(page);
    await editMerchantPage.goToDataSynchronization();
    await editMerchantPage.handleNoResultsAndSyncIfNeeded();

    await brokerPage.openBrokerTab();
    await brokerPage.table.clickSort("Updated On");
    const ascData = await brokerPage.getAllBrokerData();
    console.log("Ascending Sort Working");

    await brokerPage.table.clickSort("Updated On");
    const descData = await brokerPage.getAllBrokerData();
    console.log("Descending Sort Working");

});

test('(AN-T27297) Check Created dated On Filter functionality', async ({ page }) => {

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
    const brokerPage = new BrokerPage(page);
    await editMerchantPage.goToDataSynchronization();
    await editMerchantPage.handleNoResultsAndSyncIfNeeded();

    await brokerPage.openBrokerTab();
    await brokerPage.table.clickSort("Created On");
    const ascData = await brokerPage.getAllBrokerData();
    console.log("Ascending Sort Working");

    await brokerPage.table.clickSort("Created On");
    const descData = await brokerPage.getAllBrokerData();
    console.log("Descending Sort Working");

});

// test('(AN-T27297) Click on Name column for checking Sorting', async ({ page }) => {

//     test.setTimeout(120000);
//     const adminPage = new AdminPage(page);
//     await page.goto('https://admin.qat.anddone.com/#/login', {
//         waitUntil: 'domcontentloaded',
//     });
//     await adminPage.login('AdminTejasUser', 'Tejasadmin@1111');
//     const adminHomePage = new AdminHomePage(page);
//     await adminHomePage.searchByDBAAndValidate('tejasmerchant3');
//     await adminHomePage.openActionDropdownAndValidate();
//     await adminHomePage.clickEditSubMerchantDetails();
//     const editMerchantPage = new AdminEditMerchantPage(page);
//     const brokerPage = new BrokerPage(page);
//     await editMerchantPage.goToDataSynchronization();
//     await editMerchantPage.handleNoResultsAndSyncIfNeeded();

//     await brokerPage.openBrokerTab();
//     console.log("\n--- NAME SORT ASC ---");
//     await brokerPage.table.clickSort("Name");
//     const ascData = await brokerPage.getAllBrokerData();
//     console.log("✓ Name sorted ascending");

//     console.log("\n--- NAME SORT DESC ---");
//     await brokerPage.table.clickSort("Name");
//     const descData = await brokerPage.getAllBrokerData();
//     console.log("✓ Name sorted descending");

// });

test('(AN-T27297) Verify Name Filter functionality', async ({ page }) => {

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
    const brokerPage = new BrokerPage(page);
    await editMerchantPage.goToDataSynchronization();
    await editMerchantPage.handleNoResultsAndSyncIfNeeded();

    await brokerPage.openBrokerTab();
    await brokerPage.table.applyColumnFilter('Name', 'RPS');
    const values = await brokerPage.table.getColumnValues('name');
    expect(brokerPage.table.validateColumnContains(values, 'RPS')).toBeTruthy();

});

test('(AN-T27297) Verify AD ID Filter functionality', async ({ page }) => {

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
    const brokerPage = new BrokerPage(page);
    await editMerchantPage.goToDataSynchronization();
    await editMerchantPage.handleNoResultsAndSyncIfNeeded();

    await brokerPage.openBrokerTab();
    await brokerPage.table.applyColumnFilter('AD ID', 'GX1Q2WX1-BRK-BO6JOV8bm');
    const values = await brokerPage.table.getColumnValues('ad id');
    expect(brokerPage.table.validateColumnContains(values, 'GX1Q2WX1-BRK-BO6JOV8bm')).toBeTruthy();

});

test('(AN-T27297) Verify Customer ID Filter functionality', async ({ page }) => {

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
    const brokerPage = new BrokerPage(page);
    await editMerchantPage.goToDataSynchronization();
    await editMerchantPage.handleNoResultsAndSyncIfNeeded();

    await brokerPage.openBrokerTab();
    await brokerPage.table.applyColumnFilter('Customer ID', 'a67c6560-b7f6-42b9-b6d0-64');
    const values = await brokerPage.table.getColumnValues('customer id');
    expect(brokerPage.table.validateColumnContains(values, 'a67c6560-b7f6-42b9-b6d0-64')).toBeTruthy();

});


test('(AN-T27297) Verify IPFS Name Filter functionality', async ({ page }) => {

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
    const brokerPage = new BrokerPage(page);
    await editMerchantPage.goToDataSynchronization();
    await editMerchantPage.handleNoResultsAndSyncIfNeeded();

    await brokerPage.openBrokerTab();
    await brokerPage.table.applyColumnFilter('IPFS Name', 'AON');
    const values = await brokerPage.table.getColumnValues('ipfs name');
    expect(brokerPage.table.validateColumnContains(values, 'AON')).toBeTruthy();

});

test('(AN-T27294) Verify Multiple Filters Together with pagination', async ({ page }) => {

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
    const brokerPage = new BrokerPage(page);
    await editMerchantPage.goToDataSynchronization();
    await editMerchantPage.handleNoResultsAndSyncIfNeeded();

    await brokerPage.openBrokerTab();
    await brokerPage.table.applyColumnFilter('IPFS Name', 'AON');
    await brokerPage.table.applyDropdownFilter('Status', 'Active');
    const values = await brokerPage.table.getColumnValues('ipfs name');
    expect(brokerPage.table.validateColumnContains(values, 'AON')).toBeTruthy();

});

// Get Broker Data from API
test('API Flow - Get Brokers', async ({ request }) => {

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
    const brokerResponse = await GetBrokerRequest.getBroker(merchantId);
    expect(brokerResponse.status()).toBe(200);
    const json = await brokerResponse.json();

    console.log("API Broker Response:");
    console.log(JSON.stringify(json, null, 2));
    expect(json.value.records.length).toBeGreaterThan(0);
});

// Validate Broker Data of UI and API
test('(AN-T27292), (AN-T27296) Validate Broker Data - UI vs API', async ({ page, request }) => {
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
    const brokerPage = new BrokerPage(page);
    await editMerchantPage.goToDataSynchronization();
    const uiBrokerData = await brokerPage.getAllBrokerData();

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
    const brokerResponse = await GetBrokerRequest.getBroker(merchantId);
    const apiBrokerData = await brokerResponse.json();

    // ---------- VALIDATION ----------
    const mismatches = CoverageValidator.compareBrokers(
        apiBrokerData,
        uiBrokerData
    );

    console.log("Broker Validation Result:", mismatches);

});