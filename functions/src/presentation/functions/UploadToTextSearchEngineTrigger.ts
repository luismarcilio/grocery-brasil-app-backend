import { DatabaseTrigger } from "./DatabaseTrigger";
import { Product } from "../../model/Product";
import { UploadToTextSearchEngineUseCase } from "../../features/Product/useCase/UploadToTextSearchEngineUseCase";
import { ProductException } from "../../core/ApplicationException";
import { errorToApplicationException } from "../../core/utils";
export class UploadToTextSearchEngineTrigger
  implements DatabaseTrigger<Product> {
  private readonly uploadToTextSearchEngineUseCase: UploadToTextSearchEngineUseCase;
  constructor(
    uploadToTextSearchEngineUseCase: UploadToTextSearchEngineUseCase
  ) {
    this.uploadToTextSearchEngineUseCase = uploadToTextSearchEngineUseCase;
  }

  async call(input: Product): Promise<Product | null> {
    try {
      if (!input) {
        return Promise.resolve(null);
      }
      const result = await this.uploadToTextSearchEngineUseCase.execute(input);

      if (result instanceof ProductException) {
        return Promise.resolve(null);
      }
      return result;
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  }
}
