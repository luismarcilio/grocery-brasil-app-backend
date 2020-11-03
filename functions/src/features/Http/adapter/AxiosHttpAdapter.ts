import { HttpAdapter } from "./HttpAdapter";
import { HttpResponse, HttpRequest } from "../../../core/HttpProtocol";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { HttpAdapterException } from "../../../core/ApplicationException";
import { errorToApplicationException } from "../../../core/utils";

export class AxiosHttpAdapter implements HttpAdapter {
  private readonly axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }
  getBuffer = async (
    url: string,
    httpRequest?: HttpRequest
  ): Promise<HttpResponse> => {
    try {
      const config: AxiosRequestConfig = { responseType: "arraybuffer" };
      if (httpRequest) {
        config.headers = httpRequest.headers;
      }
      const axiosResponse = await this.axiosInstance.get(url, config);
      const returnData: HttpResponse = {
        status: axiosResponse.status,
        body: axiosResponse.data,
      };
      return returnData;
    } catch (error) {
      throw errorToApplicationException(error, HttpAdapterException);
    }
  };

  get = async (
    url: string,
    httpRequest?: HttpRequest
  ): Promise<HttpResponse> => {
    try {
      const config: AxiosRequestConfig = {};
      if (httpRequest) {
        config.headers = httpRequest.headers;
      }
      const axiosResponse = await this.axiosInstance.get(url, config);
      const returnData: HttpResponse = {
        status: axiosResponse.status,
        body: axiosResponse.data?.body,
      };
      return returnData;
    } catch (error) {
      throw errorToApplicationException(error, HttpAdapterException);
    }
  };
}
