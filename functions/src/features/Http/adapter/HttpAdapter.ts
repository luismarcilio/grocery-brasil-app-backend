import { HttpResponse } from "../../../protocol/HttpProtocol";

export interface HttpAdapter {
    get:(url: string)=> Promise<HttpResponse>
}