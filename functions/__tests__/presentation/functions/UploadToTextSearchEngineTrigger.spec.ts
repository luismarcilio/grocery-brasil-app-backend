import { UploadToTextSearchEngineUseCase } from "../../../src/features/Product/useCase/UploadToTextSearchEngineUseCase";
import { DatabaseTrigger } from "../../../src/presentation/functions/DatabaseTrigger";
import { UploadToTextSearchEngineTrigger } from "../../../src/presentation/functions/UploadToTextSearchEngineTrigger";
import { Product } from "../../../src/model/Product";
import { product } from "../../features/Product/fixture/product";
import {
  ProductException,
  MessageIds,
} from "../../../src/core/ApplicationException";
describe("UploadToTextSearchEngineTrigger", () => {
  const execute = jest.fn();
  const uploadToTextSearchEngineUseCase: UploadToTextSearchEngineUseCase = ({
    execute,
  } as unknown) as UploadToTextSearchEngineUseCase;

  const sut: DatabaseTrigger<Product> = new UploadToTextSearchEngineTrigger(
    uploadToTextSearchEngineUseCase
  );
  it("should check if product is present", async () => {
    const someProduct = (undefined as unknown) as Product;
    const actual = await sut.call(someProduct);
    expect(actual).toBeNull();
    expect(execute).not.toHaveBeenCalled();
  });

  it("should upload the product to search engine", async () => {
    const someProduct = { ...product };
    const expected = { ...someProduct };
    execute.mockResolvedValue(expected);
    const actual = await sut.call(someProduct);
    expect(actual).toEqual(expected);
    expect(execute).toHaveBeenCalledWith(someProduct);
  });

  it("should throw product exceptio if some exception occurs", async () => {
    const someException = new Error("error");
    const someProduct = { ...product };

    const expected = new ProductException({
      messageId: MessageIds.UNEXPECTED,
      message: (someException as unknown) as string,
    });
    execute.mockRejectedValue(someException);

    await expect(sut.call(someProduct)).rejects.toEqual(expected);
  });
});
