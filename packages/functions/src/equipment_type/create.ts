import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { EquipmentType } from "@chargebot-services/core/services/equipment_type";
import auditCreation from "../shared/middlewares/audit-create";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CreateEquipmentTypeSchema, EquipmentTypeResponseSchema } from "./equipment_type.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any, context: any) => {
    console.log('Request to create EquipmentType:', event, context);
    const equipment_type = await EquipmentType.create(event.body);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: equipment_type
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(jsonBodyParser())
    .use(auditCreation())
    .use(validator({ eventSchema: CreateEquipmentTypeSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: EquipmentTypeResponseSchema }));