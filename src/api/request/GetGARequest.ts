import { BaseAPI, Header, Headers, VariableFactory } from 'anddonejs1';

export class GetGARequest extends BaseAPI {

   static async getGA(merchantId: string, headers?: Header) {

        const defaultValue = {
            origin: BaseAPI.getBaseUrl2(),
            authorization: VariableFactory.getLoginToken() 
        };

        const apiurl=BaseAPI.getBaseUrl2() + '/pf/merchants/' + merchantId + '/ga' + `?pageIndex=1` + '&pageSize=100` + `&sortField=name` + `&ascending=false';
        return BaseAPI.sendRequest(
            "GET",
            apiurl,
            {
                headers: {
                    ...Headers.getHeaders({ ...defaultValue, ...headers })
                }
            }
        );
    }

}