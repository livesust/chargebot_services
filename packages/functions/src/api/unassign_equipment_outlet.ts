import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema } from "../schemas/assign_equipment_outlet.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { OutletEquipment } from "@chargebot-services/core/services/outlet_equipment";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const equipment_id = +event.pathParameters!.equipment_id!;
  const outlet_id = +event.pathParameters!.outlet_id!;
  const user_id = event.requestContext?.authorizer?.jwt.claims.sub;

  try {
    const existent = await OutletEquipment.findOneByCriteria({ equipment_id, outlet_id });
    if (!existent) {
      throw createError(404, "equipment is not assigned to the outlet", { expose: true });
    }

    await OutletEquipment.remove(existent.id!, user_id);

    return createSuccessResponse({ "response": "success" });

  } catch (error) {
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(500, "cannot unassign equipment from outlet", { expose: true });
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
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());