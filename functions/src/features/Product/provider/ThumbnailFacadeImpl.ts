import { ThumbnailFacade } from "./ThumbnailFacade";
import { Product } from "../../../model/Product";
import { ImageManipulationAdapter } from "../../Image/adapter/ImageManipulationAdapter";
import { FileServerRepository } from "../../FileServer/repository/FileServerRepository";
import { MimeTypeAdapter } from "../../MimeType/adapter/MimeTypeAdapter";
import { HttpAdapter } from "../../Http/adapter/HttpAdapter";
import { HttpResponse } from "../../../core/HttpProtocol";
import {
  ProductException,
  MessageIds,
} from "../../../core/ApplicationException";
import { errorToApplicationException } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";
export class ThumbnailFacadeImpl implements ThumbnailFacade {
  private readonly imageManipulationAdapter: ImageManipulationAdapter;
  private readonly fileServerRepository: FileServerRepository;
  private readonly mimeTypeAdapter: MimeTypeAdapter;
  private readonly httpAdapter: HttpAdapter;

  constructor(
    imageManipulationAdapter: ImageManipulationAdapter,
    fileServerRepository: FileServerRepository,
    mimeTypeAdapter: MimeTypeAdapter,
    httpAdapter: HttpAdapter
  ) {
    this.fileServerRepository = fileServerRepository;
    this.httpAdapter = httpAdapter;
    this.imageManipulationAdapter = imageManipulationAdapter;
    this.mimeTypeAdapter = mimeTypeAdapter;
  }

  @withLog(loggerLevel.DEBUG)
  async uploadThumbnail(product: Product): Promise<Product> {
    if (!product.thumbnail) {
      return Promise.reject(
        new ProductException({
          messageId: MessageIds.INVALID_ARGUMENT,
          message: "product.thumbnail is falsee",
        })
      );
    }

    try {
      const response: HttpResponse = await this.httpAdapter.getBuffer(
        product.thumbnail
      );
      if (response.status !== 200) {
        return Promise.reject(
          new ProductException({
            messageId: MessageIds.UNEXPECTED,
            message: `cannot download thumbnail. http status: ${response.status}`,
          })
        );
      }
      const image: Buffer = response.body;
      const mimeType = await this.mimeTypeAdapter.getMimeType(image);
      if (!mimeType?.includes("image")) {
        return Promise.reject(
          new ProductException({
            messageId: MessageIds.UNEXPECTED,
            message: `wrong type downloaded: ${mimeType}`,
          })
        );
      }

      const resizedImage: Buffer = await this.imageManipulationAdapter.resize(
        100,
        100,
        image
      );

      const urlArray = product.thumbnail.split("/");
      const fileName = urlArray[urlArray.length - 1].replace(/ /g, "_");

      const newThumbnailUrl: string = await this.fileServerRepository.save(
        resizedImage,
        "grocery-brasil-app-thumbnails",
        fileName,
        mimeType
      );

      const updatedProduct = { ...product };
      updatedProduct.thumbnail = newThumbnailUrl;
      return updatedProduct;
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  }
}
