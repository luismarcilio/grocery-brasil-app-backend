import { MinifierAdapter } from "./MinifierAdapter";
import { MinifyOptions, MinifyOutput } from "uglify-es";
import {
  PurchaseException,
  MessageIds,
} from "../../../core/ApplicationException";

export class MinifierAdapterUglifyJs implements MinifierAdapter {
  private readonly minifyFunction: (
    files: string | string[] | { [file: string]: string },
    options?: MinifyOptions
  ) => MinifyOutput;
  constructor(
    minifyFunction: (
      files: string | string[] | { [file: string]: string },
      options?: MinifyOptions
    ) => MinifyOutput
  ) {
    this.minifyFunction = minifyFunction;
  }

  minify(javascript: string): Promise<string> {
    const result = this.minifyFunction(javascript);
    if (result.error) {
      return Promise.reject(
        new PurchaseException({
          messageId: MessageIds.UNEXPECTED,
          message: (result.error as unknown) as string,
        })
      );
    }
    return Promise.resolve(result.code);
  }
}
