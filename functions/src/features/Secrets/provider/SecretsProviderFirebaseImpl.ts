import { SecretsProvider } from "./SecretsProvider";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager/build/src/v1";
import { project_id } from "../../../configuration";
import {
  SecretException,
  MessageIds,
} from "../../../core/ApplicationException";
import { errorToApplicationException } from "../../../core/utils";

export class SecretsProviderFirebaseImpl implements SecretsProvider {
  private readonly secretManagerServiceClient: SecretManagerServiceClient;
  constructor(secretManagerServiceClient: SecretManagerServiceClient) {
    this.secretManagerServiceClient = secretManagerServiceClient;
  }

  async getSecret(keyName: string): Promise<string> {
    try {
      const secretName = `projects/${project_id}/secrets/${keyName}/versions/latest`;
      const [
        secret,
      ] = await this.secretManagerServiceClient.accessSecretVersion({
        name: secretName,
      });

      if (secret?.payload?.data) {
        const secretKey = secret.payload.data.toString();
        return secretKey;
      }
      throw new SecretException({
        messageId: MessageIds.NOT_FOUND,
        message: `Secret not found: ${keyName}`,
      });
    } catch (error) {
      throw errorToApplicationException(error, SecretException);
    }
  }
}
