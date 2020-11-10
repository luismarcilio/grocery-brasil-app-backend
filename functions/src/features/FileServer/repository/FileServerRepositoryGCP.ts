import { FileServerRepository } from "./FileServerRepository";
import { Storage } from "@google-cloud/storage";
import { withLog, loggerLevel } from "../../../core/Logging";

export class FileServerRepositoryGCP implements FileServerRepository {
  private readonly storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  @withLog(loggerLevel.DEBUG)
  async save(
    file: Buffer,
    bucket: string,
    fileName: string,
    contentType: string
  ): Promise<string> {
    const p = new Promise<string>((resolve, reject) => {
      const writeStream = this.storage
        .bucket(bucket)
        .file(fileName)
        .createWriteStream({
          gzip: true,
          public: true,
          resumable: false,
          metadata: {
            contentType,
          },
        });
      writeStream.on("error", reject).on("finish", resolve).end(file);
    });

    await p;
    return Promise.resolve(
      `https://storage.googleapis.com/${bucket}/${fileName}`
    );
  }
}
