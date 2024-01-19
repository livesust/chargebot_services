import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { IdPathParamSchema } from "../shared/schemas";
import { ArrayResponseSchema } from "../schemas/bot_outlets.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { Outlet } from "@chargebot-services/core/services/outlet";
import { ChargebotPDU } from "@chargebot-services/core/services/analytics/chargebot_pdu";
import { Bot } from "@chargebot-services/core/services/bot";
import { OutletEquipment } from "@chargebot-services/core/services/outlet_equipment";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_id = +event.pathParameters!.id!;

  try {
    const bot = await Bot.get(bot_id);

    if (!bot){
      return createNotFoundResponse({ "response": "bot not found" });
    }

    const [outlets, outletPriority] = await Promise.all([
      Outlet.findByCriteria({bot_id: bot.id}),
      ChargebotPDU.getOutletPriorityCharging(bot.bot_uuid),      
    ]);

    const response = [];
    for (const outlet of outlets) {
      const pdu_outlet_number = outlet.pdu_outlet_number - 1;

      const [outletStatus, outletEquipment] = await Promise.all([
        ChargebotPDU.getOutletStatus(bot.bot_uuid, pdu_outlet_number),
        OutletEquipment.findOneByCriteria({outlet_id: outlet.id})
      ]);

      const equipment = outletEquipment ? outletEquipment.equipment : undefined;

      response.push({
        id: outlet.id,
        pdu_outlet_number: outlet.pdu_outlet_number,
        priority_charge: outletPriority?.outlet_id === outlet.pdu_outlet_number - 1,
        status: outletStatus?.status,
        status_timestamp: outletStatus?.timestamp,
        equipment_name: equipment?.name
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