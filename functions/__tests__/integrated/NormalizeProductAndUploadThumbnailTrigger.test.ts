import { makeNormalizeProductAndUploadThumbnailTrigger } from "../../src/factories";
import { Product } from "../../src/model/Product";

describe("NormalizeProductAndUploadThumbnailTrigger", () => {
  it("should upload to test search engine", async () => {
    jest.setTimeout(30000);
    const sut = makeNormalizeProductAndUploadThumbnailTrigger();
    const product: Product = {
      eanCode: "7891962051338",
      name: "PAO DE FORMA TRADICIONAL 400G VISCONTI",
      ncmCode: "19059010",
      unity: { name: "PT" },
    };
    const expected = { ...product };
    expected.normalized = true;
    expected.thumbnail =
      "https://storage.googleapis.com/grocery-brasil-app-thumbnails/7891962051338";

    const actual = await sut.call(product);
    expect(actual).toEqual(expected);
  });
});
