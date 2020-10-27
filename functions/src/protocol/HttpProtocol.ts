/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpRequest {
  body?: any;
  headers?: any;
}

export interface HttpResponse {
  headers?: any;
  status: number;
  body?: any;
}
