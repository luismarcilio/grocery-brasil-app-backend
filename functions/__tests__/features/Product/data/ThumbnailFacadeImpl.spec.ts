import { HttpAdapter } from "../../../../src/features/Http/adapter/HttpAdapter";
import { ImageManipulationAdapter } from "../../../../src/features/Image/adapter/ImageManipulationAdapter";
import { FileServerRepository } from "../../../../src/features/FileServer/repository/FileServerRepository";
import { MimeTypeAdapter } from "../../../../src/features/MimeType/adapter/MimeTypeAdapter";
import { ThumbnailFacade } from "../../../../src/features/Product/provider/ThumbnailFacade";
import { product } from "../fixtures";
import {
  ProductException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import { ThumbnailFacadeImpl } from "../../../../src/features/Product/provider/ThumbnailFacadeImpl";
import { HttpResponse } from "../../../../src/core/HttpProtocol";

describe("ThumbnailFacade", () => {
  const get = jest.fn();
  const getBuffer = jest.fn();
  const httpAdapter: HttpAdapter = {
    get,
    getBuffer,
  };
  const resize = jest.fn();
  const imageManipulationAdapter: ImageManipulationAdapter = {
    resize,
  };
  const save = jest.fn();

  const fileServerRepository: FileServerRepository = {
    save,
  };

  const getMimeType = jest.fn();
  const mimeTypeAdapter: MimeTypeAdapter = {
    getMimeType,
  };

  const sut: ThumbnailFacade = new ThumbnailFacadeImpl(
    imageManipulationAdapter,
    fileServerRepository,
    mimeTypeAdapter,
    httpAdapter
  );
  it("should download the thumbnail", async () => {
    const image = new Buffer("image");
    const resizedImage = new Buffer("resizedImage");
    const updatedProduct = { ...product };
    updatedProduct.thumbnail = "updatedThumbnail";
    const httpResponse: HttpResponse = {
      status: 200,
      body: image,
    };
    getBuffer.mockResolvedValue(httpResponse);
    getMimeType.mockResolvedValue("image/jpg");
    resize.mockResolvedValue(resizedImage);
    save.mockResolvedValue("updatedThumbnail");
    const actual = await sut.uploadThumbnail(product);
    expect(actual).toEqual(updatedProduct);
    expect(getBuffer).toHaveBeenCalledWith(product.thumbnail);
    expect(getMimeType).toHaveBeenCalledWith(image);
    // expect(resize).toHaveBeenCalledWith(image);
    expect(save).toHaveBeenCalledWith(
      resizedImage,
      "grocery-brasil-app-thumbnails",
      "7896100501829"
    );
  });

  it("should assert that it is a image or throw an error otherwise", async () => {
    const expected = new ProductException({
      messageId: MessageIds.UNEXPECTED,
      message: "wrong type downloaded: text/html",
    });

    const image = new Buffer("image");
    const resizedImage = new Buffer("resizedImage");
    const updatedProduct = { ...product };
    updatedProduct.thumbnail = "updatedThumbnail";
    const httpResponse: HttpResponse = {
      status: 200,
      body: image,
    };
    getBuffer.mockResolvedValue(httpResponse);
    getMimeType.mockResolvedValue("text/html");
    resize.mockResolvedValue(resizedImage);
    save.mockResolvedValue("updatedThumbnail");

    await expect(sut.uploadThumbnail(product)).rejects.toEqual(expected);
  });
  it("should throw an error on exception", async () => {
    const someException = new Error("error");

    const expected = new ProductException({
      messageId: MessageIds.UNEXPECTED,
      message: (someException as unknown) as string,
    });
    const resizedImage = new Buffer("resizedImage");
    const updatedProduct = { ...product };
    updatedProduct.thumbnail = "updatedThumbnail";
    getBuffer.mockRejectedValue(someException);
    getMimeType.mockResolvedValue("text/html");
    resize.mockResolvedValue(resizedImage);
    await expect(sut.uploadThumbnail(product)).rejects.toEqual(expected);
  });
});
