import * as express from "express";
import * as cors from "cors";
import { expressMiddlewareAdapter } from "../middlewares/ExpressMiddlewareAdapter";
import {
  makeAuthenticationMiddleware,
  makeGetSecrectController,
  makeParseAndSaveNFController,
  makeGetWebViewScrapDataController,
} from "../../factories";
import { expressRouteAdapter } from "./expressRouteAdapter";

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));
app.use(expressMiddlewareAdapter(makeAuthenticationMiddleware()));

app.get("/secret", expressRouteAdapter(makeGetSecrectController()));
app.post(
  "/parseAndSaveNf/:state",
  expressRouteAdapter(makeParseAndSaveNFController())
);
app.get(
  "/nfDataByInitialUrl",
  expressRouteAdapter(makeGetWebViewScrapDataController())
);

export default app;
