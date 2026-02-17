import { BaseAPI, Header, Headers, VariableFactory } from 'anddonejs1';

export class GetCarrierRequest extends BaseAPI {

   static async getCarrier(merchantId: string, headers?: Header) {

        const defaultValue = {
            origin: BaseAPI.getBaseUrl2(),
            authorization: VariableFactory.getLoginToken() 
        };

        const apiurl=BaseAPI.getBaseUrl2() + '/pf/merchants/' + merchantId + '/carrier' + `?pageIndex=1` + '&pageSize=100` + `&sortField=Alias` + `&ascending=false' + '&Status=Active' + '&PortalStatus=Active';
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