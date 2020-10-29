import { HttpRequest, HttpResponse } from "../../../core/HttpProtocol";

export interface Controller {
  handle: (request: HttpRequest) => Promise<HttpResponse>;
}
