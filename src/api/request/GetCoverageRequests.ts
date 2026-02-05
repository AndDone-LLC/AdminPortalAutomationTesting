import { BaseAPI, Header, Headers, VariableFactory } from 'anddonejs1';

export class GetCoverageRequest extends BaseAPI {

    static async getCoverage(merchantId: string, headers?: Header) {

        const defaultValue = {
            origin: this.getBaseUrl2(),
            authorization: VariableFactory.getLoginToken() 
        };

        const apiUrl =
            this.getBaseUrl2() +
            `/pf/merchants/${merchantId}/coverage` +
            `?pageSize=10000` +
            `&pageIndex=1` +
            `&sortField=name` +
            `&ascending=true` +
            `&search=` +
            `&adUniqueId=` +
            `&pfName=` +
            `&pfCoverageType=` +
            `&isMapped=` +
            `&isLocked=` +
            `&status=` +
            `&portalStatus=`;

        return this.sendRequest(
            "GET",
            apiUrl,
            {
                headers: {
                    ...Headers.getHeaders({ ...defaultValue, ...headers })
                }
            }
        );
    }
}