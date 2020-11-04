import { ImageManipulationAdapter } from "./ImageManipulationAdapter";
import { Sharp, SharpOptions } from "sharp";

export class ImageManipulationAdapterSharp implements ImageManipulationAdapter {
  private readonly sharp: (
    input?: string | Buffer,
    options?: SharpOptions
  ) => Sharp;

  constructor(
    sharp: (input?: string | Buffer, options?: SharpOptions) => Sharp
  ) {
    this.sharp = sharp;
  }

  resize = (heigth: number, width: number, image: Buffer): Promise<Buffer> => {
    return this.sharp(image).resize(width, heigth).toBuffer();
  };
}
