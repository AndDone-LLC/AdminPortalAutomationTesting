import { BaseAPI } from "anddonejs1";

export class GetGAResponse extends BaseAPI{
    static async getAllGA(){
        return await this.getResponse();
    }
}