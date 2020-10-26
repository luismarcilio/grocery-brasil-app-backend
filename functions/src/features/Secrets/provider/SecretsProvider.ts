export interface SecretsProvider {
  getSecret: (keyName: string) => Promise<string>;
}
