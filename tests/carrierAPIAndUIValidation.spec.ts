import { config } from '../src/config/config';
import { test, expect } from '@playwright/test';
import { AdminPage } from '../src/pages/AdminLoginPage';
import { AdminHomePage } from '../src/pages/AdminHomePage';
import { AdminEditMerchantPage } from '../src/pages/AdminEditMerchantPage';
import { ApiUtils, LoginPayload, LoginRequest, VariableFactory } from 'anddonejs1';
import { LoginResponse } from 'anddonejs1/dist/api/response/login.response';
import { CoverageValidator } from '../src/validators/CoverageValidator';
import {CarrierPage} from '../src/pages/CarrierPage';
import { GetCarrierRequest } from '../src/api/request/GetCarrierRequest';
import { getEnv } from '../src/config/envUtils';
import { get } from 'node:http';

test.beforeAll(async () => {
    VariableFactory.setEnvorimentData('qat');
});

test('Carrier API and UI Validation', async ({ page, request }) => {

    test.setTimeout(120000);
    const adminPage = new AdminPage(page);
        await page.goto(config.baseUrl + '/login', {
        waitUntil: 'domcontentloaded',
    });
        await adminPage.login(process.env.ADMIN_USERNAME ?? '', process.env.ADMIN_PASSWORD ?? '');
        const adminHomePage = new AdminHomePage(page);  
        await adminHomePage.searchByDBAAndValidate(process.env.MERCHANT_DBA_NAME_SETTING_OFF ?? '');
    await adminHomePage.openActionDropdownAndValidate();
    await adminHomePage.clickEditSubMerchantDetails();
    const editMerchantPage = new AdminEditMerchantPage(page);
    await editMerchantPage.goToDataSynchronization();
    await editMerchantPage.handleNoResultsAndSyncIfNeeded();
    await editMerchantPage.carrierTabButton.click();
    const carrierPage = new CarrierPage(page);
    const uiCarrierData = await carrierPage.getAllCarrierData();
    console.log("UI Carrier Data: ", uiCarrierData);
    console.log("");

    ApiUtils.setRequest(request);
        const loginPay = LoginPayload.getPayload({
            userName: process.env.ADMIN_USERNAME ?? '',
            password: process.env.ADMIN_PASSWORD ?? ''
        });
    await ApiUtils.setResponse(
        await LoginRequest.login(loginPay, {
            origin: VariableFactory.getMerchantPortalUrl()
        })
    );
    VariableFactory.setLoginToken(await LoginResponse.getToken());
    const merchantId = await LoginResponse.getResponseValue('merchantId');
    const carrierResponse = await GetCarrierRequest.getCarrier(merchantId);
    expect(carrierResponse.status()).toBe(200);
    const json = await carrierResponse.json();


    //validation
    const mismatches = CoverageValidator.compareCarrierData(
        json,
        uiCarrierData
    );
    if (mismatches.length > 0) {
        console.log("Mismatches found:");
        mismatches.forEach((mismatch) => console.log(mismatch));
    } else {
        console.log("No mismatches found.");
    }
});