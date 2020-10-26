export interface ApiKeyProvider {
  getApiKey: (keyName: string) => Promise<string>;
}
