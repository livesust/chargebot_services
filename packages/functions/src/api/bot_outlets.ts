import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { IdPathParamSchema } from "../shared/schemas";
import { ArrayResponseSchema } from "../schemas/bot_outlets.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { Outlet } from "@chargebot-services/core/services/outlet";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_id = +event.pathParameters!.id!;

  try {
    const outlets = await Outlet.findByCriteria({bot_id: bot_id});
    const response = [];
    for (const outlet of outlets) {
      response.push({
        id: outlet.id,
        pdu_outlet_number: outlet.pdu_outlet_number,
        force_charge_now: false,
        status: 'OFF',
        status_timestamp: new Date()
      });
    }
    return createSuccessResponse(response);
  } catch (error) {
    console.log(JSON.stringify(error));
    const httpError = createError(500, "cannot query bot outlets ", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(validator({ pathParametersSchema: IdPathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(validator({ responseSchema: ArrayResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());