export interface FileServerRepository {
  save: (file: Buffer, bucket: string, fileName: string) => Promise<string>;
}
