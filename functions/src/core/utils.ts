/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ApplicationException, MessageIds } from "./ApplicationException";

export function parseDate(dateString: string): Date {
  const year = +dateString.split("/")[2];
  const mon = +dateString.split("/")[1] - 1;
  const day = +dateString.split("/")[0];

  return new Date(year, mon, day);
}

export const errorToApplicationException = <T extends ApplicationException>(
  error: any,
  constructor: new (data: { messageId: MessageIds; message: string }) => T
): T => {
  if (error.constructor.name === constructor.name) {
    return error;
  }
  return new constructor({ messageId: MessageIds.UNEXPECTED, message: error });
};
