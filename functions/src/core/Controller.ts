import { HttpRequest, HttpResponse } from "./HttpProtocol";

export interface Controller {
  handle: (request: HttpRequest) => Promise<HttpResponse>;
}
