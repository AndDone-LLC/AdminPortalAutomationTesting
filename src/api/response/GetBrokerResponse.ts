import { BaseAPI } from "anddonejs1";

export class GetBrokerResponse extends BaseAPI{
    static async getAllBroker(){
        return await this.getResponse();
    }
}