import { BaseAPI } from "anddonejs1";

export class GetProgramsResponse extends BaseAPI{
    static async getAllPrograms(){
        return await this.getResponse();
    }
}