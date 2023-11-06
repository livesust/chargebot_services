import { ApiHandler } from "sst/node/api";

export const main = ApiHandler(async (_evt) => {
  return {
    statusCode: 404,
    body: "Not Found",
  };
});