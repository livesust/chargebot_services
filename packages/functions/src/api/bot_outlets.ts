import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { BotUUIDPathParamSchema } from "../shared/schemas";
import { ArrayResponseSchema } from "../schemas/bot_outlets.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { Outlet } from "@chargebot-services/core/services/outlet";
import { ChargebotPDU } from "@chargebot-services/core/services/analytics/chargebot_pdu";
import { DateTime } from "luxon";
import { Equipment } from "@chargebot-services/core/services/equipment";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;

  try {
    const [outlets, outletPriority] = await Promise.all([
      Outlet.findByBot(bot_uuid),
      ChargebotPDU.getOutletPriorityCharging(bot_uuid),      
    ]);

    // Split the outlet processing into separate promises using map.
    // Each outlet is processed concurrently, allowing for better parallelism.
    const outletPromises = outlets.map(async (outlet) => {
      const [outletStatus, equipment] = await Promise.all([
        ChargebotPDU.getOutletStatus(bot_uuid, outlet.pdu_outlet_number),
        Equipment.findByOutlet(outlet.id!)
      ]);

      return {
        id: outlet.id,
        pdu_outlet_number: outlet.pdu_outlet_number,
        priority_charge: outletPriority?.outlet_id === outlet.pdu_outlet_number - 1,
        priority_charge_state: outlet.priority_charge_state,
        status: outletStatus?.status,
        status_timestamp: outletStatus && DateTime.fromJSDate(outletStatus.timestamp).setZone('UTC').toISO(),
        equipment_name: equipment?.name
      };
    });
    
    // Promise.allSettled is used to wait for all promises to settle, regardless of whether they resolve or reject.
    // The responses are then filtered to retrieve only the fulfilled promises, and their values are extracted.
    const response = await Promise.all(outletPromises);

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    console.log(JSON.stringify(error));
    const httpError = createError(406, "cannot query bot outlets ", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(validator({ pathParametersSchema: BotUUIDPathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer(false))
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ArrayResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());