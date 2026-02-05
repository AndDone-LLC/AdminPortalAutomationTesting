import { test} from '@playwright/test';
import { apiData, ApiUtils, LoginPayload, LoginRequest, VariableFactory } from 'anddonejs1';
import {LoginResponse} from 'anddonejs1/dist/api/response/login.response';
import { GetProgramsRequest } from '../src/api/request/GetProgramsRequest';
import { GetCoverageRequest } from '../src/api/request/GetCoverageRequests';
// import localApiData from '../testData/api.data.json';

test.beforeAll(async({})=>{
    VariableFactory.setEnvorimentData('qat');
})

test('Get Programs', async ({ page, request }) => {
    ApiUtils.setRequest(request);
    const userName = "tejasmerchant3";
    const password = "Tejasmerchant@11";

    const loginPay = LoginPayload.getPayload({userName: userName, password: password});
    await ApiUtils.setResponse(await LoginRequest.login(loginPay, {origin: VariableFactory.getMerchantPortalUrl()}));
    VariableFactory.setLoginToken(await LoginResponse.getToken());

    const merchantId = await LoginResponse.getResponseValue('merchantId');

    // const programsResponse = await GetProgramsRequest.getPrograms(merchantId);
    // const json = await programsResponse.json();
    // console.log("Programs Response:", JSON.stringify(json, null, 2));

    const coverageResponse = await GetCoverageRequest.getCoverage(merchantId);
    const json2 = await coverageResponse.json();
    console.log("Coverage Response:", JSON.stringify(json2, null, 2));
})