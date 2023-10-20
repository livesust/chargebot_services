import { ApiHandler } from "sst/node/api";
import { Bot } from "@chargebot-services/core/bot";

export const main = ApiHandler(async (_evt) => {
  return {
    statusCode: 404,
    body: "Not Found",
  };
});