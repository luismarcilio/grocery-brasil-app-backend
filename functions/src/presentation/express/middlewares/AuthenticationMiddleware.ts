import { Middleware } from "./Middleware";
import { HttpRequest, HttpResponse } from "../../../core/HttpProtocol";
import { User } from "../../../model/User";
import { UseCase } from "../../../core/UseCase";

export class AuthenticationMiddleware implements Middleware {
  private readonly getUserByJWTUseCase: UseCase<User>;

  constructor(getUserByJWTUseCase: UseCase<User>) {
    this.getUserByJWTUseCase = getUserByJWTUseCase;
  }

  handle = async (request: HttpRequest): Promise<HttpResponse> => {
    const jwt = request.headers?.Authorization?.split("Bearer ")[1];
    if (jwt === undefined) {
      const response: HttpResponse = {
        body: "Unauthorized",
        status: 401,
      };

      return Promise.resolve(response);
    }

    const result = await this.getUserByJWTUseCase.execute(jwt);

    if (result.constructor.name === "UserException") {
      const response: HttpResponse = {
        body: "Unauthorized",
        status: 401,
      };

      return Promise.resolve(response);
    }
    const response: HttpResponse = {
      headers: request.headers,
      body: request.body,
      status: 200,
    };
    response.body.user = <User>result;
    return response;
  };
}
