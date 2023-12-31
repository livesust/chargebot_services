import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { BotUUIDPathParamSchema } from "../shared/schemas";
import { ResponseSchema } from "../schemas/bot_location.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotGps, translateVehicleStatus } from "@chargebot-services/core/services/analytics/chargebot_gps";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;

  try {
    const location = await ChargebotGps.getLastPositionByBot(bot_uuid);

    return createSuccessResponse({
      bot_uuid: location?.device_id,
      timestamp: location?.timestamp,
      vehicle_status: translateVehicleStatus(location?.vehicle_status),
      latitude: location?.lat,
      longitude: location?.lon,
      altitude: location?.altitude,
      speed: location?.speed,
      bearing: location?.bearing,
      arrived_at: location?.arrived_at,
      left_at: location?.left_at,
    });
  } catch (error) {
    const httpError = createError(500, "cannot query bot location ", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(validator({ pathParametersSchema: BotUUIDPathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());