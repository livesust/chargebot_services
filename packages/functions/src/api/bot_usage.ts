import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { BotUUIDPathParamSchema } from "../shared/schemas";
import { ResponseSchema } from "../schemas/chargebot_gps.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotGps, translateVehicleStatus } from "@chargebot-services/core/services/chargebot_gps";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
    const bot_uuid = event.pathParameters!.bot_uuid!;

    let response;

    try {
        response = await ChargebotGps.getByBot(bot_uuid);
    } catch (error) {
        const httpError = createError(500, "cannot query bot location ", { expose: true });
        httpError.details = (<Error>error).message;
        throw httpError;
    }

    return createSuccessResponse({
      bot_uuid: response?.device_id,
      timestamp: response?.timestamp,
      vehicle_status: translateVehicleStatus(response?.vehicle_status),
      latitude: response?.lat,
      longitude: response?.lon,
      altitude: response?.altitude,
      speed: response?.speed,
      bearing: response?.bearing,
      arrived_at: response?.arrived_at,
      left_at: response?.left_at,
    });
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