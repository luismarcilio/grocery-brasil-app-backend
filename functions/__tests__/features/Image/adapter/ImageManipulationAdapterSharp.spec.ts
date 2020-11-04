import { ImageManipulationAdapter } from "../../../../src/features/Image/adapter/ImageManipulationAdapter";
import { ImageManipulationAdapterSharp } from "../../../../src/features/Image/adapter/ImageManipulationAdapterSharp";
// import * as sharp from "sharp";
describe("ImageManipulationAdapterSharp", () => {
  // const resize = jest.fn()
  // const sharpStub : (input?: string | Buffer, options?: sharp.SharpOptions) => sharp.Sharp = jest.fn((_)=> {return sharpStub})

  // const sharp:Sharp = {
  //     resize
  // } as unknown as Sharp
  //   const sharp = jest.mock("sharp");

  const someImage = new Buffer("someImage");
  const someResizedImage = new Buffer("someResizedImage");

  const sharp = jest.fn();
  const resize = jest.fn();
  const toBuffer = jest.fn();
  sharp.mockReturnValue({ resize });
  resize.mockReturnValue({ toBuffer });
  toBuffer.mockResolvedValue(someResizedImage);

  const sut: ImageManipulationAdapter = new ImageManipulationAdapterSharp(
    sharp
  );
  it("should resize the image", async () => {
    const actual = await sut.resize(100, 100, someImage);
    expect(actual).toEqual(someResizedImage);
    expect(sharp).toHaveBeenCalledWith(someImage);
    expect(resize).toHaveBeenCalledWith(100, 100);
    expect(toBuffer).toHaveBeenCalledWith();
  });
});
