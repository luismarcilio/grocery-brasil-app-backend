import * as functions from "firebase-functions";

import app from "../presentation/express/app";
import { firebaseTriggerAdapter } from "../presentation/functions/firebaseTriggerAdapter";
import {
  makeUploadToTextSearchEngineTrigger,
  makeNormalizeProductAndUploadThumbnailTrigger,
} from "../factories";

export const v1 = functions.https.onRequest(app);
export const uploadToElasticsearch = firebaseTriggerAdapter(
  "PRODUTOS/{productId}",
  makeUploadToTextSearchEngineTrigger()
);
export const uploadThumbnail = firebaseTriggerAdapter(
  "PRODUTOS/{productId}",
  makeNormalizeProductAndUploadThumbnailTrigger()
);
