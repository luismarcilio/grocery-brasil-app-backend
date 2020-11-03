export interface MimeTypeAdapter {
  getMimeType: (file: Buffer) => Promise<string>;
}
