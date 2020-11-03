export interface ImageManipulationAdapter {
  resize: (heigth: number, width: number, image: Buffer) => Promise<Buffer>;
}
