import { MimeTypeAdapter } from "../../../../src/features/MimeType/adapter/MimeTypeAdapter";
import { MimeTypeAdapterFileType } from "../../../../src/features/MimeType/adapter/MimeTypeAdapterFileType";
describe("MimeTypeAdapterFileType", () => {
  const fromBuffer = jest.fn();

  const FileType = {
    fromBuffer,
  };
  const sut: MimeTypeAdapter = new MimeTypeAdapterFileType(FileType);

  it("should return the mime type of the buffer", async () => {
    const someFile = new Buffer("someImage");
    const fileTypeResult = { mime: "image/jpg" };
    fromBuffer.mockResolvedValue(fileTypeResult);
    const actual = await sut.getMimeType(someFile);

    expect(actual).toEqual("image/jpg");
    expect(fromBuffer).toHaveBeenCalledWith(someFile);
  });
});
