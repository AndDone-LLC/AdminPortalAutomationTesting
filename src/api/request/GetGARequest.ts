import { BaseAPI, Header, Headers, VariableFactory } from 'anddonejs1';

export class GetGARequest extends BaseAPI {

   static async getGA(merchantId: string, headers?: Header) {

        const defaultValue = {
            origin: BaseAPI.getBaseUrl2(),
            authorization: VariableFactory.getLoginToken() 
        };

        const baseUrl = BaseAPI.getBaseUrl2();
        const url = new URL(`/pf/merchants/${merchantId}/ga`, baseUrl);
        url.search = new URLSearchParams({
            PageIndex: '1',
            PageSize: '10000',
            SortField: 'name',
            Ascending: 'false'
        }).toString();
        const apiurl = url.toString();

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