export interface SecretsProvider {
  getApiKey: (keyName: string) => Promise<string>;
}
