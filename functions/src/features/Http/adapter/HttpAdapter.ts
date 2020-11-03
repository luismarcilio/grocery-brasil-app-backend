import { HttpResponse, HttpRequest } from "../../../core/HttpProtocol";

export interface HttpAdapter {
  get: (url: string, httpRequest?: HttpRequest) => Promise<HttpResponse>;
  getBuffer: (url: string, httpRequest?: HttpRequest) => Promise<HttpResponse>;
}
