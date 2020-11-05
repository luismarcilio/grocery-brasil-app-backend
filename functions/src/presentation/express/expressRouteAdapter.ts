import { Request, Response } from "express";
import { Controller } from "../controllers/Controller";
import { HttpRequest } from "../../core/HttpProtocol";
export const expressRouteAdapter = (controller: Controller) => {
  return  async (request: Request, response: Response):Promise<void> => {
    const httpRequest: HttpRequest = {
      params: request.params,
      body: request.body,
    };

    const httpResponse = await controller.handle(httpRequest);
    response.status(httpResponse.status).send(httpResponse.body);
  };
};
