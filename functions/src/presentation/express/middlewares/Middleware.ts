import { HttpRequest, HttpResponse } from "../../../core/HttpProtocol";

export interface Middleware {
  handle: (request: HttpRequest) => Promise<HttpResponse>;
}
