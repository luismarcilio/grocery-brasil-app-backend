/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { MimeTypeAdapter } from "./MimeTypeAdapter";
import { withLog, loggerLevel } from "../../../core/Logging";

export class MimeTypeAdapterFileType implements MimeTypeAdapter {
  private readonly fileType: any;

  constructor(fileType: any) {
    this.fileType = fileType;
  }

  @withLog(loggerLevel.DEBUG)
  async getMimeType(file: Buffer): Promise<string | undefined> {
    const fileTypeResult = await this.fileType.fromBuffer(file);
    return fileTypeResult?.mime;
  }
}
