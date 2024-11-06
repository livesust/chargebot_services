import middy from "@middy/core";
import { createError, HttpError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse } from "../shared/rest_utils";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { ChargebotSystem } from "@chargebot-services/core/services/analytics/chargebot_system";
import { SystemVariables } from "@chargebot-services/core/timescale/chargebot_system";
import { processBotDiscovery } from "./bot_discovery";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  // bot_uuid from IoT, device_id from API
  const data = event.state;
  const device_id = data.device_id ?? event.thingName;

  try {
    if (!device_id) {
      return createError(400, "bot uuid not provided", { expose: true });
    }

    await ChargebotSystem.updateConnectionStatus({
      device_id: device_id,
      device_version: data.device_version ?? "unknown",
      timestamp: new Date(),
      timezone: "Etc/UTC",
      variable: SystemVariables.CONNECTED,
      value_boolean: data.connected === "true",
      data_type: "boolean"
    });

    await processBotDiscovery(device_id, data.device_version);

    return createSuccessResponse({ "response": "success" });

  } catch (error) {
    Log.error("ERROR", { error });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot send alert", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  // .use(executionTimeLogger())
  .use(httpEventNormalizer())
  .use(jsonBodyParser({ reviver: dateReviver }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());