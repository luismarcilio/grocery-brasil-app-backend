import { Middleware } from "./Middleware";
import { HttpRequest } from "../../core/HttpProtocol";
import * as express from "express";

export const expressMiddlewareAdapter = (middleware: Middleware) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const httpRequest: HttpRequest = {
      headers: req.headers,
      body: req.body,
    };

    const httpResponse = await middleware.handle(httpRequest);
    if (httpResponse.status === 200) {
      req.body = httpResponse.body;
      next();
      return;
    }

    res.status(httpResponse.status).send(httpResponse.body);
  };
};
