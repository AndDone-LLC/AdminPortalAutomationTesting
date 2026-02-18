import { BaseAPI, Header, Headers, VariableFactory } from 'anddonejs1';

export class GetBrokerRequest extends BaseAPI {

    static async getBroker(
        merchantId: string,
        pageIndex: number = 1,
        pageSize: number = 300,
        sortField: string = "name",
        ascending: boolean = false,
        headers?: Header
    ) {

        const defaultValue = {
            origin: this.getBaseUrl2(),
            authorization: VariableFactory.getLoginToken()
        };

        const apiUrl =
            this.getBaseUrl2() +
            `/pf/merchants/${merchantId}/broker` +
            `?PageIndex=${pageIndex}` +
            `&PageSize=${pageSize}` +
            `&SortField=${sortField}` +
            `&Ascending=${ascending}`;

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
