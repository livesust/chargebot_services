import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { EquipmentTypeArrayResponseSchema } from "./equipment_type.schema";
import { EquipmentType } from "@chargebot-services/core/services/equipment_type";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const equipment_types = await EquipmentType.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: equipment_types
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: EquipmentTypeArrayResponseSchema }));