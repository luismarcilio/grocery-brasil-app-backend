import { HttpResponse } from "../../../core/HttpProtocol";

export interface HttpAdapter {
    get:(url: string)=> Promise<HttpResponse>
}