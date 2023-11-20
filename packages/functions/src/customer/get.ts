import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import { Customer } from "@chargebot-services/core/services/customer";
import { IdPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CustomerResponseSchema } from "./customer.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const customer = await Customer.get(+event.pathParameters!.id!);

    if (!customer) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" }
        };
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: customer,
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(validator({ eventSchema: IdPathParamSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: CustomerResponseSchema }));