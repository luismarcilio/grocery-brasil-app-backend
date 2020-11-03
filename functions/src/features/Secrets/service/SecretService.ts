export interface SecretService {
  get: (id: string) => Promise<string>;
}
