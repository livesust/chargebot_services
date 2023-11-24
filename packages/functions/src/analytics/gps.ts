import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { BotUUIDPathParamSchema } from "../shared/schemas";
import { ArrayResponseSchema } from "../schemas/chargebot_gps.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotGps } from "@chargebot-services/core/services/chargebot_gps";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
    const bot_uuid = event.pathParameters!.bot_uuid!;

    let records;

    try {
        records = await ChargebotGps.getByBot(bot_uuid);
    } catch (error) {
        const httpError = createError(500, "cannot query chargebot gps positions ", { expose: true });
        httpError.details = (<Error>error).message;
        throw httpError;
    }

    return createSuccessResponse(records);
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(validator({ pathParametersSchema: BotUUIDPathParamSchema }))
    // after: inverse order execution
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: ArrayResponseSchema }))
    // httpErrorHandler must be the last error handler attached, first to execute.
    // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
    .use(httpErrorHandler());