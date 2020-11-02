import { MinifierAdapter } from "./MinifierAdapter";
import { Options } from "minify";
import {
  PurchaseException,
  MessageIds,
} from "../../../core/ApplicationException";

export class MinifierAdapterMinify implements MinifierAdapter {
  private readonly minifyFunction: (
    name: string,
    options?: Options
  ) => Promise<string>;

  constructor(
    minifyFunction: (name: string, options?: Options) => Promise<string>
  ) {
    this.minifyFunction = minifyFunction;
  }

  minify = async (javascript: string): Promise<string> => {
    try {
      return await this.minifyFunction(javascript);
    } catch (error) {
      throw new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: error,
      });
    }
  };
}
