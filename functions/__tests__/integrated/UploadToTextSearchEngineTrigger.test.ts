import { makeUploadToTextSearchEngineTrigger } from "../../src/factories";
import { product } from "../features/Product/fixture/product";

describe("UploadToTextSearchEngineTrigger", () => {
  it("should upload to test search engine", async () => {
    const sut = makeUploadToTextSearchEngineTrigger();

    const actual = await sut.call(product);
    expect(actual).toEqual(product);
    console.log(actual);
  });
});
