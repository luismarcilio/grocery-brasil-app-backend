export interface FileServerRepository {
  save: (
    file: Buffer,
    bucket: string,
    fileName: string,
    contentType: string
  ) => Promise<string>;
}
