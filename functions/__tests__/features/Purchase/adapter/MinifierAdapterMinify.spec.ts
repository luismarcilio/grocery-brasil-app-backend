import { MinifierAdapter } from "../../../../src/features/Purchase/adapter/MinifierAdapter";
import { MinifierAdapterMinify } from "../../../../src/features/Purchase/adapter/MinifierAdapterMinify";
import {
  PurchaseException,
  MessageIds,
} from "../../../../src//core/ApplicationException";

describe("MinifierAdapterMinify", () => {
  const minify = jest.fn();
  const sut: MinifierAdapter = new MinifierAdapterMinify(minify);

  it("should call minify and retur minified javascript", async () => {
    const expected = "minifiedJS";
    minify.mockResolvedValue(expected);
    const actual = await sut.minify("javascript");
    expect(actual).toEqual(expected);
    expect(minify).toHaveBeenCalledWith("javascript");
  });

  it("should throw unexpected on some error", async () => {
    const expected = new Error("someError");
    minify.mockRejectedValue(expected);
    await expect(sut.minify("javascript")).rejects.toEqual(
      new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: (expected as unknown) as string,
      })
    );
  });
});
