import { BaseAPI } from "anddonejs1";

export class GetCarrierResponse extends BaseAPI{
    static async getAllCarrier(){
        return await this.getResponse();
    }
}