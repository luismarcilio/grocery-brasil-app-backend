/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ProductException, MessageIds } from "../../core/ApplicationException";

export const errorToProductException = (error: any): ProductException => {
  if (error.constructor.name === "ProductException") {
    return error;
  }
  return new ProductException({
    messageId: MessageIds.UNEXPECTED,
    message: error,
  });
};
