import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
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
import { OutletEquipment } from "@chargebot-services/core/services/outlet_equipment";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const customer_id = +event.pathParameters!.customer_id!;

  try {
    const equipments = await Equipment.findByCriteria({ customer_id });

    const result = [];
    for (const e of equipments) {

      const outlet = (await OutletEquipment.findOneByCriteria({equipment_id: e.id}))?.outlet;

      result.push({
        id: e.id,
        name: e.name,
        brand: e.brand,
        description: e.description,
        voltage: e.voltage,
        max_charging_amps: e.max_charging_amps,
        equipment_type_id: e.equipment_type_id,
        customer_id: e.customer_id,
        equipment_type: e.equipment_type,
        outlet: outlet
      });
    }

    return createSuccessResponse(result);
  } catch (error) {
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