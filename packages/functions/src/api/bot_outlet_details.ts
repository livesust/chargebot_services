import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema, ResponseSchema } from "../schemas/bot_outlet_details.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { Outlet } from "@chargebot-services/core/services/outlet";
import { OutletEquipment } from "@chargebot-services/core/services/outlet_equipment";
import { OutletSchedule } from "@chargebot-services/core/services/outlet_schedule";
import { ChargebotPDU } from "@chargebot-services/core/services/analytics/chargebot_pdu";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;
  const outlet_id = +event.pathParameters!.outlet_id!;

  try {
    const outlet = await Outlet.get(outlet_id);

    if (!outlet) {
      return createNotFoundResponse({ "response": "outlet not found" });
    }

    const [outletStatus, outletPriority, outletSchedule, outletEquipment] = await Promise.all([
      ChargebotPDU.getOutletStatus(bot_uuid, outlet.pdu_outlet_number),
      ChargebotPDU.getOutletPriorityCharging(bot_uuid),
      OutletSchedule.findOneByCriteria({outlet_id: outlet.id}),
      OutletEquipment.findOneByCriteria({outlet_id: outlet.id})
    ]);

    const equipment = outletEquipment ? outletEquipment.equipment : undefined;

    const response = {
      id: outlet.id,
      pdu_outlet_number: outlet.pdu_outlet_number,
      priority_charge: outletPriority?.outlet_id === outlet.pdu_outlet_number - 1,
      status: outletStatus?.status,
      status_timestamp: outletStatus?.timestamp,
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
      outlet_schedule: {
        id: outletSchedule?.id,
        all_day: outletSchedule?.all_day,
        start_time: outletSchedule?.start_time,
        end_time: outletSchedule?.end_time,
        day_of_week: outletSchedule?.day_of_week,
      }
    };

    return createSuccessResponse(response);
  } catch (error) {
    const httpError = createError(500, "cannot query bot outlets ", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(validator({ pathParametersSchema: PathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());