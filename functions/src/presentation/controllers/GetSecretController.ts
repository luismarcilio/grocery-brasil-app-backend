import { Controller } from "./Controller";
import { HttpResponse, HttpRequest } from "../../core/HttpProtocol";
import { GetSecretUseCase } from "../../features/Secrets/useCase/GetSecretUseCase";
import { SecretException, MessageIds } from "../../core/ApplicationException";
export class GetSecretController implements Controller {
  private readonly getSecretUseCase: GetSecretUseCase;

  constructor(getSecretUseCase: GetSecretUseCase) {
    this.getSecretUseCase = getSecretUseCase;
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const secretName = request.params.secret;
    const result = await this.getSecretUseCase.execute(secretName);
    if (result instanceof SecretException) {
      let status: number;
      if (result.messageId === MessageIds.NOT_FOUND) {
        status = 404;
      } else {
        status = 500;
      }
      const response: HttpResponse = {
        status,
        body: result.message,
      };
      return response;
    }
    const response: HttpResponse = {
      status: 200,
      body: { secretValue: result },
    };
    return response;
  }
}
