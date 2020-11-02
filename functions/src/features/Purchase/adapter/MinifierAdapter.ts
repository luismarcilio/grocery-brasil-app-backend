export interface MinifierAdapter {
  minify: (javascript: string) => Promise<string>;
}
