import { BaseAPI, Header, Headers, VariableFactory } from 'anddonejs1';

export class GetProgramsRequest extends BaseAPI {

    static async getPrograms(merchantId: string, headers?: Header) {

        // this.setApiData("getPrograms");

        // const defaultValue = {
        //     origin: this.getBaseUrl2(),
        //     contentType: 'application/json'
        // }

        // let apiPath = this.getApiPath().replace("{merchantId}", merchantId);

        // return this.sendRequest(
        //     this.geApiMethod(),
        //     this.getBaseUrl2() + apiPath,
        //     {
        //         headers: Headers.getHeaders({ ...defaultValue, ...headers }),
        //         Authorization: `Bearer ${VariableFactory.getLoginToken()}`
        //     }
        // );

        const defaultValue = { origin: this.getBaseUrl2(),  authorization: VariableFactory.getLoginToken() };
        const apiUrl = this.getBaseUrl2() + `/pf/merchants/${merchantId}/programs`;
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