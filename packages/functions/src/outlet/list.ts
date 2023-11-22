import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { OutletArrayResponseSchema } from "./outlet.schema";
import { Outlet } from "@chargebot-services/core/services/outlet";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const outlets = await Outlet.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: outlets
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: OutletArrayResponseSchema }));