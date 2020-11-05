import { HttpAdapter } from "../../../../src/features/Http/adapter/HttpAdapter";
import { AxiosHttpAdapter } from "../../../../src/features/Http/adapter/AxiosHttpAdapter";
import { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import {
  HttpAdapterException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import { HttpResponse, HttpRequest } from "../../../../src/core/HttpProtocol";

describe("AxiosHttpAdapter", () => {
  const get = jest.fn();
  const post = jest.fn();
  const axiosInstance: AxiosInstance = ({
    get,
    post
  } as unknown) as AxiosInstance;
  const sut: HttpAdapter = new AxiosHttpAdapter(axiosInstance);

  const axiosResponse: AxiosResponse = {
    data: { body: "all OK" },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {},
  };

  it("should throw HttpAdapterException on error", async () => {
    jest.spyOn(axiosInstance, "get").mockImplementation(() => {
      throw "Error";
    });
    await expect(sut.get("someUrl")).rejects.toEqual(
      new HttpAdapterException({
        messageId: MessageIds.UNEXPECTED,
        message: "Error",
      })
    );
  });

  describe("get", () => {
    it("should perform get operation", async () => {
      jest.clearAllMocks();
      const httpRequest: HttpRequest = {
        headers: { "x-header": "x-header-test" },
      };
      const expectedAxiosRequestConfig: AxiosRequestConfig = {
        headers: httpRequest.headers,
      };

      const expected: HttpResponse = { status: 200, body: "all OK" };
      get.mockResolvedValue(axiosResponse);
      const actual = await sut.get("someUrl", httpRequest);
      expect(actual).toEqual(expected);
      expect(get).toHaveBeenCalledWith("someUrl", expectedAxiosRequestConfig);
    });
  });

  describe("post", () => {
    it("should perform post operation", async () => {
      jest.clearAllMocks();
      const httpRequest: HttpRequest = {
        headers: { "x-header": "x-header-test" },
        body: "some data to post"
      };
      const expectedAxiosRequestConfig: AxiosRequestConfig = {
        headers: httpRequest.headers,
      };

      const expected: HttpResponse = { status: 200, body: "all OK" };
      post.mockResolvedValue(axiosResponse);
      const actual = await sut.post("someUrl", httpRequest);
      expect(actual).toEqual(expected);
      expect(post).toHaveBeenCalledWith("someUrl", "some data to post",expectedAxiosRequestConfig);
    });
  });


});
