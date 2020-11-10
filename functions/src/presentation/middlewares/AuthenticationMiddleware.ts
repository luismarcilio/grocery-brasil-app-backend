import { Middleware } from "./Middleware";
import { HttpRequest, HttpResponse } from "../../core/HttpProtocol";
import { User } from "../../model/User";
import { UseCase } from "../../core/UseCase";
import { withLog, loggerLevel } from "../../core/Logging";

export class AuthenticationMiddlewareTest implements Middleware {
  private readonly getUserByJWTUseCase: UseCase<User>;

  constructor(getUserByJWTUseCase: UseCase<User>) {
    this.getUserByJWTUseCase = getUserByJWTUseCase;
  }

  @withLog(loggerLevel.DEBUG)
  handle(request: HttpRequest): Promise<HttpResponse> {
    this.getUserByJWTUseCase;
    const response: HttpResponse = {
      headers: request.headers,
      body: request.body,
      status: 200,
    };
    response.body.user = {
      userId: "testUserId",
      email: "luismarcilio@yahoo.com.br",
      address: {
        rawAddress:
          "Av. Epitácio Pessoa, 2566 - Ipanema, Rio de Janeiro - RJ, 22471-003, Brasil",
        street: "Avenida Epitácio Pessoa",
        number: "2566",
        poCode: "22471-003",
        county: "Ipanema",
        city: { name: "Rio de Janeiro" },
        state: { name: "Rio de Janeiro", acronnym: "RJ" },
        country: { name: "Brasil" },
        lat: -22.9749636,
        lon: -43.1984787,
      },
      preferences: { searchRadius: 30000 },
    };
    return Promise.resolve(response);
  }
}

export class AuthenticationMiddleware implements Middleware {
  private readonly getUserByJWTUseCase: UseCase<User>;

  constructor(getUserByJWTUseCase: UseCase<User>) {
    this.getUserByJWTUseCase = getUserByJWTUseCase;
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const jwt = request.headers?.Authorization?.split("Bearer ")[1];
    if (jwt === undefined) {
      const httpResponse: HttpResponse = {
        body: "Unauthorized",
        status: 401,
      };

      return Promise.resolve(httpResponse);
    }

    const result = await this.getUserByJWTUseCase.execute(jwt);

    if (result.constructor.name === "UserException") {
      const httpResponse: HttpResponse = {
        body: "Unauthorized",
        status: 401,
      };

      return Promise.resolve(httpResponse);
    }
    const response: HttpResponse = {
      headers: request.headers,
      body: request.body,
      status: 200,
    };
    response.body.user = <User>result;
    return response;
  }
}
