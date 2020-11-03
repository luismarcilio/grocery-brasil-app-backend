import { SecretService } from "./SecretService";
import { SecretsProvider } from "../provider/SecretsProvider";
import { errorToApplicationException } from "../../../core/utils";
import { SecretException } from "../../../core/ApplicationException";

export class SecretServiceImpl implements SecretService {
  private readonly secretsProvider: SecretsProvider;
  constructor(secretsProvider: SecretsProvider) {
    this.secretsProvider = secretsProvider;
  }

  get = async (id: string): Promise<string> => {
    try {
      const secret = await this.secretsProvider.getSecret(id);
      return secret;
    } catch (error) {
      throw errorToApplicationException(error, SecretException);
    }
  };
}
