import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema, ResponseSchema } from "../schemas/bot_outlet_details.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { Outlet } from "@chargebot-services/core/services/outlet";
import { OutletSchedule } from "@chargebot-services/core/services/outlet_schedule";
import { ChargebotPDU } from "@chargebot-services/core/services/analytics/chargebot_pdu";
import { Equipment } from "@chargebot-services/core/services/equipment";
import { DateTime } from "luxon";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;
  const outlet_id = +event.pathParameters!.outlet_id!;

  try {
    const outlet = await Outlet.lazyGet(outlet_id);

    if (!outlet) {
      return createNotFoundResponse({ "response": "outlet not found" });
    }

    const [outletStatus, outletPriority, outletSchedule, equipment] = await Promise.all([
      ChargebotPDU.getOutletStatus(bot_uuid, outlet.pdu_outlet_number),
      ChargebotPDU.getOutletPriorityCharging(bot_uuid),
      OutletSchedule.findOneByCriteria({outlet_id: outlet.id}),
      Equipment.findByOutlet(outlet.id!)
    ]);

    const response = {
      id: outlet.id,
      pdu_outlet_number: outlet.pdu_outlet_number,
      priority_charge: outletPriority?.outlet_id === outlet.pdu_outlet_number - 1,
      priority_charge_state: outlet.priority_charge_state,
      status: outletStatus?.status,
      status_timestamp: outletStatus && DateTime.fromJSDate(outletStatus.timestamp).setZone('UTC').toISO(),
      equipment: equipment && {
        id: equipment.id,
        name: equipment.name,
        brand: equipment.brand,
        equipment_type: {
          id: equipment.equipment_type?.id,
          type: equipment.equipment_type?.type,
          description: equipment.equipment_type?.description,
        }
      },
      outlet_schedule: outletSchedule && {
        id: outletSchedule.id,
        all_day: outletSchedule.all_day,
        start_time: outletSchedule.start_time,
        end_time: outletSchedule.end_time,
        day_of_week: outletSchedule.day_of_week,
      }
    };

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    const httpError = createError(406, "cannot query bot outlets ", { expose: true });
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
  .use(validator({ pathParametersSchema: PathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer(false))
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());