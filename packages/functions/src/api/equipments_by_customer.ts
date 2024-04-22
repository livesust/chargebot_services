import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema, ArrayResponseSchema } from "../schemas/equipments_by_customer.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { Equipment } from "@chargebot-services/core/services/equipment";
import { Outlet } from "@chargebot-services/core/services/outlet";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const customer_id = +event.pathParameters!.customer_id!;

  try {
    const equipments = await Equipment.findByCriteria({ customer_id });

    const promises = equipments.map(async (equipment) => {
      const outlet = await Outlet.findByEquipment(equipment.id!);
      return {
        id: equipment.id,
        name: equipment.name,
        brand: equipment.brand,
        description: equipment.description,
        voltage: equipment.voltage,
        max_charging_amps: equipment.max_charging_amps,
        equipment_type_id: equipment.equipment_type_id,
        customer_id: equipment.customer_id,
        equipment_type: equipment.equipment_type && {
          id: equipment.equipment_type.id,
          type: equipment.equipment_type.type,
          description: equipment.equipment_type.description
        },
        outlet: outlet && {
          id: outlet.id,
          pdu_outlet_number: outlet.pdu_outlet_number,
          notes: outlet.notes,
          bot_id: outlet.bot_id
        }
      };
    });

    const result = await Promise.all(promises);

    return createSuccessResponse(result);
  } catch (error) {
    Log.error("ERROR", { error });
    const httpError = createError(406, "cannot query equipments by customer", { expose: true });
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
  .use(validator({ pathParametersSchema: PathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ArrayResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());