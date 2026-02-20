import { test, expect } from '@playwright/test';
import { AdminPage } from '../src/pages/AdminLoginPage';
import { AdminHomePage } from '../src/pages/AdminHomePage';
import { AdminEditMerchantPage } from '../src/pages/AdminEditMerchantPage';
import { ApiUtils, LoginPayload, LoginRequest, VariableFactory } from 'anddonejs1';
import { LoginResponse } from 'anddonejs1/dist/api/response/login.response';
import {CarrierPage} from '../src/pages/CarrierPage';
import { GetGARequest } from '../src/api/request/GetGARequest';
import { GetCarrierRequest } from '../src/api/request/GetCarrierRequest';
import { GAPage } from '../src/pages/GAPage.spec';
import { CoverageValidator } from '../src/validators/CoverageValidator';
import { getEnv } from '../src/CommonUtils/envUtils';


test.beforeAll(async () => {
    VariableFactory.setEnvorimentData('qat');
});

test('GA Secure API and UI Validation', async ({ page, request }) => {

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
    const gaResponse = await GetGARequest.getGA(merchantId);
    expect(gaResponse.status()).toBe(200);
    const json = await gaResponse.json();
    console.log("API GA Data: ", json);

    
});

