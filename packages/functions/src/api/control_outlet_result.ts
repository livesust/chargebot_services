import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { Outlet } from "@chargebot-services/core/services/outlet";
import { OutletPriorityChargeState } from "@chargebot-services/core/database/outlet";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const outlet = await Outlet.findByBotAndPduOutletNumber(event.device_id, event.outlet_id + 1);
  if (!outlet) {
    return;
  }
  await Outlet.update(outlet.id!, {
    priority_charge_state: !event.result
      ? OutletPriorityChargeState.INACTIVE
      : (event.command == 'start_priority_charge' ? OutletPriorityChargeState.ACTIVE : OutletPriorityChargeState.INACTIVE)
  })
  
};

export const main = middy(handler)
  // before
  // .use(executionTimeLogger())
  .use(httpEventNormalizer())
  .use(jsonBodyParser({ reviver: dateReviver }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());