import { HttpAdapter } from "./HttpAdapter";
import { HttpResponse } from "../../../core/HttpProtocol";
import { AxiosInstance } from "axios";
import { HttpAdapterException } from "../../../core/ApplicationException";
import { errorToApplicationException } from "../../../core/utils";

export class AxiosHttpAdapter implements HttpAdapter {
  private readonly axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  get = async (url: string): Promise<HttpResponse> => {
    try {
      const axiosResponse = await this.axiosInstance.get(url);
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
