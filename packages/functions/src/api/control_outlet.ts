import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError, HttpError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { ControlOutletSchema } from "../schemas/control_outlet.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { BotUUIDPathParamSchema, SuccessResponseSchema } from "src/shared/schemas";
import { Outlet } from "@chargebot-services/core/services/outlet";
import { IoTData } from "@chargebot-services/core/services/aws/iot_data";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { OutletPriorityChargeState } from "@chargebot-services/core/database/outlet";

// @ts-expect-error ignore any type for event
export const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;
  const body = event.body;

  try {
    const outlet = await Outlet.findByBotAndPduOutletNumber(bot_uuid, body.pdu_outlet_number);
    if (!outlet) {
      return createNotFoundResponse({ "response": "outlet not found" });
    }

    const payload = {
      // firmware expects outlet ids from 0 to 7
      "outlet_id": body.pdu_outlet_number - 1,
      "command": body.command
    };

    const topic = `chargebot/control/${bot_uuid}/outlet`;

    const sent = await IoTData.publish(topic, payload);

    if (sent) {
      await Outlet.update(outlet.id!, {
        priority_charge_state: body.command == 'start_priority_charge'
          ? OutletPriorityChargeState.ACTIVATING
          : (body.command == 'stop_priority_charge' ? OutletPriorityChargeState.DEACTIVATING : OutletPriorityChargeState.INACTIVE)
      })
      return createSuccessResponse({ "response": "success" });
    } else {
      await Outlet.update(outlet.id!, {
        priority_charge_state: OutletPriorityChargeState.INACTIVE
      })
      throw createError(406, "error publishing command to device", { expose: true });
    }

  } catch (error) {
    Log.error("ERROR", { error });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot assign equipment to outlet", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  // .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(jsonBodyParser({ reviver: dateReviver }))
  .use(validator({
    pathParametersSchema: BotUUIDPathParamSchema,
    eventSchema: ControlOutletSchema
  }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: SuccessResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());