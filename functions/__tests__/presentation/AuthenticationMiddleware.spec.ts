/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from "../../src/model/User";
import { UseCase } from "../../src/core/UseCase";
import { UserException, MessageIds } from "../../src/core/ApplicationException";
import { Middleware } from "../../src/presentation/express/middlewares/Middleware";
import { AuthenticationMiddleware } from "../../src/presentation/express/middlewares/AuthenticationMiddleware";
import { HttpRequest } from "../../src/core/HttpProtocol";

describe("AuthenticationMiddleware", () => {
  const execute = jest.fn();
  const getUserByJWTUseCase: UseCase<User> = { execute };
  const sut: Middleware = new AuthenticationMiddleware(getUserByJWTUseCase);
  const someUser: User = {
    userId: "userId",
    email: "user@email",
    address: { rawAddress: "some address" },
    preferences: { searchRadius: 100 },
  };

  it("should insert user in the body and call next if all is ok", async () => {
    const request: HttpRequest = {
      body: {},
      headers: { Authorization: "Bearer jwt" },
    };
    execute.mockResolvedValue(someUser);
    const response = await sut.handle(request);
    expect(response.status).toEqual(200);
    expect(response.body.user).toEqual(someUser);
    expect(execute).toHaveBeenCalledWith("jwt");
  });
  it("should return 401 if authorization header doesn't exist", async () => {
    const request: HttpRequest = {
      body: {},
    };
    execute.mockResolvedValue(someUser);
    const response = await sut.handle(request);
    expect(response.body).toEqual("Unauthorized");
    expect(response.status).toEqual(401);
  });
  it("should return 401 if authorization isn't bearer", async () => {
    const request: HttpRequest = {
      headers: { Authorization: "XXXXX jwt" },
      body: {},
    };
    execute.mockResolvedValue(someUser);
    const response = await sut.handle(request);
    expect(response.body).toEqual("Unauthorized");
    expect(response.status).toEqual(401);
  });
  it("should return 401 if jwt token is invalid", async () => {
    const request: HttpRequest = {
      body: {},
      headers: { Authorization: "Bearer jwt" },
    };
    execute.mockImplementation((_) =>
      Promise.resolve(
        new UserException({ messageId: MessageIds.UNEXPECTED, message: "Erro" })
      )
    );
    const response = await sut.handle(request);
    expect(response.status).toEqual(401);
  });
  it("should return 401 if user doesn't exist", async () => {
    const request: HttpRequest = {
      body: {},
      headers: { Authorization: "Bearer jwt" },
    };
    execute.mockResolvedValue(
      new UserException({
        messageId: MessageIds.NOT_FOUND,
        message: "User not found: jwt",
      })
    );
    const response = await sut.handle(request);
    expect(response.status).toEqual(401);
  });
});
