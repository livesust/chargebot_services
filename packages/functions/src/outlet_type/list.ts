import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { OutletTypeArrayResponseSchema } from "./outlet_type.schema";
import { OutletType } from "@chargebot-services/core/services/outlet_type";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const outlet_types = await OutletType.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: outlet_types
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: OutletTypeArrayResponseSchema }));