import { BaseAPI } from "anddonejs1";

export class GetCoverageResponse extends BaseAPI{
    static async getAllCoverage(){
        return await this.getResponse();
    }
}