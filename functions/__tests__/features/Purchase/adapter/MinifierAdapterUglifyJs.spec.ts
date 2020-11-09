import { MinifierAdapter } from "../../../../src/features/Purchase/adapter/MinifierAdapter";
import { MinifierAdapterUglifyJs } from "../../../../src/features/Purchase/adapter/MinifierAdapterUglifyJs";
import {
  PurchaseException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import * as UglifyJS from "uglify-es";

describe("MinifierAdapterMinify", () => {
  const minify = jest.fn();
  const sut: MinifierAdapter = new MinifierAdapterUglifyJs(minify);

  it("should call minify and retur minified javascript", async () => {
    const expected: UglifyJS.MinifyOutput = { code: "minifiedJs", map: "" };
    minify.mockReturnValue(expected);
    const actual = await sut.minify("javascript");
    expect(actual).toEqual(expected.code);
    expect(minify).toHaveBeenCalledWith("javascript");
  });

  it("should throw unexpected on some error", async () => {
    const expected: UglifyJS.MinifyOutput = {
      error: new Error("someError"),
      code: "",
      map: "",
    };
    minify.mockReturnValue(expected);
    await expect(sut.minify("javascript")).rejects.toEqual(
      new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: (expected.error as unknown) as string,
      })
    );
  });
});
