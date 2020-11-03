/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpRequest {
  params?: any;
  body?: any;
  headers?: any;
  options?: any;
}

export interface HttpResponse {
  headers?: any;
  status: number;
  body?: any;
}
