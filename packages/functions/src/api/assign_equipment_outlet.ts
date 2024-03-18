import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError, HttpError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema, QueryStringParamSchema } from "../schemas/assign_equipment_outlet.schema";
import { ResponseSchema } from "../schemas/outlet_equipment.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { OutletEquipment } from "@chargebot-services/core/services/outlet_equipment";
import { User } from "@chargebot-services/core/services/user";
import { Equipment } from "@chargebot-services/core/services/equipment";
import { Outlet } from "@chargebot-services/core/services/outlet";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const equipment_id = +event.pathParameters!.equipment_id!;
  const outlet_id = +event.pathParameters!.outlet_id!;
  const user_id = event.requestContext?.authorizer?.jwt.claims.sub;
  const overwrite = event.queryStringParameters?.overwrite ?? false;

  try {
    const user = await User.findOneByCriteria({user_id})

    const [
      equipment,
      outlet,
      outletEquipment,
    ] = await Promise.all([
      Equipment.get(equipment_id),
      Outlet.get(outlet_id),
      OutletEquipment.findOneByCriteria({ equipment_id, outlet_id }),
    ]);

    if (!equipment) {
      throw createError(400, "equipment does not exists", { expose: true });
    }

    if (!outlet) {
      throw createError(400, "outlet does not exists", { expose: true });
    }

    if (outletEquipment) {
      return createSuccessResponse(outletEquipment);
    }

    const [
      alreadyAssignedToOutlet,
      existentOne
    ] = await Promise.all([
      OutletEquipment.findOneByCriteria({ equipment_id }),
      OutletEquipment.findOneByCriteria({ outlet_id })
    ]);

    if (alreadyAssignedToOutlet) {
      if (!overwrite) {
        throw createError(400, "equipment assigned to another outlet", { expose: true });
      }
      // remove equipment from the other outlet
      await OutletEquipment.remove(alreadyAssignedToOutlet.id!, user_id);
    }

    if (existentOne) {
      // if outlet has another equipment assigned, unassign it
      await OutletEquipment.remove(existentOne.id!, user_id);
    }

    const now = new Date();
    const created = await OutletEquipment.create({
      created_by: user_id,
      created_date: now,
      modified_by: user_id,
      modified_date: now,
      equipment_id,
      outlet_id,
      user_id: user!.id!,
    });

    return createSuccessResponse({
      ...created?.entity,
      equipment: null,
      outlet: null,
      user: null,
    });

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
  .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(validator({ pathParametersSchema: PathParamSchema, queryStringParametersSchema: QueryStringParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());