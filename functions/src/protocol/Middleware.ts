import { HttpRequest, HttpResponse } from "./HttpProtocol";

export interface Middleware {
  handle: (request: HttpRequest) => Promise<HttpResponse>;
}
