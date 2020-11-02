export interface MinifierAdapter {
  minify: (javascript: string) => string;
}
