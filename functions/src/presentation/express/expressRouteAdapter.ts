import { Request, Response } from "express";
import { Controller } from "../controllers/Controller";
import { HttpRequest } from "../../core/HttpProtocol";
export const expressRouteAdapter = (controller: Controller) => {
  return async (request: Request, response: Response): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {};
    for (const k in request.query) {
      params[k] = request.query[k];
    }
    for (const k in request.params) {
      params[k] = request.params[k];
    }
    const httpRequest: HttpRequest = {
      params,
      body: request.body,
    };
    const httpResponse = await controller.handle(httpRequest);
    response.status(httpResponse.status).send(httpResponse.body);
  };
};
