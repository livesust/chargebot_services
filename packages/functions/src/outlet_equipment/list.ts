import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { OutletEquipmentArrayResponseSchema } from "./outlet_equipment.schema";
import { OutletEquipment } from "@chargebot-services/core/services/outlet_equipment";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const outlet_equipments = await OutletEquipment.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: outlet_equipments
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: OutletEquipmentArrayResponseSchema }));