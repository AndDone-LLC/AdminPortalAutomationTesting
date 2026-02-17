import { test, expect } from '@playwright/test';
import { AdminPage } from '../src/pages/AdminLoginPage';
import { AdminHomePage } from '../src/pages/AdminHomePage';
import { AdminEditMerchantPage } from '../src/pages/AdminEditMerchantPage';
import { ApiUtils, LoginPayload, LoginRequest, VariableFactory } from 'anddonejs1';
import { LoginResponse } from 'anddonejs1/dist/api/response/login.response';
import { GetProgramsRequest } from '../src/api/request/GetProgramsRequest';
import { GetCoverageRequest } from '../src/api/request/GetCoverageRequests';
import { CoverageValidator } from '../src/validators/CoverageValidator';
import { CoveragePage } from '../src/pages/CoveragePage';
import { GetGARequest } from '../src/api/request/GetGARequest';

test.beforeAll(async () => {
    VariableFactory.setEnvorimentData('qat');
});

// Get Program Data from API
test('API Flow - Get GA', async ({ request }) => {

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
    const GAResponse = await GetGARequest.getGA(merchantId);
    expect(GAResponse.status()).toBe(200);
    const json = await GAResponse.json();

    console.log("API GA Response:");
    console.log(JSON.stringify(json, null, 2));
    expect(json.value.records.length).toBeGreaterThan(0);
});
