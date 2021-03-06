import { UseCase } from "../../../core/UseCase";
import { SecretException } from "../../../core/ApplicationException";
import { SecretService } from "../service/SecretService";
import { errorToApplicationException } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";

export class GetSecretUseCase implements UseCase<string> {
  private readonly secretService: SecretService;
  constructor(secretService: SecretService) {
    this.secretService = secretService;
  }

  @withLog(loggerLevel.DEBUG)
  async execute(p: string): Promise<string | SecretException> {
    try {
      const secret = await this.secretService.get(p);
      return secret;
    } catch (error) {
      return errorToApplicationException(error, SecretException);
    }
  }
}
