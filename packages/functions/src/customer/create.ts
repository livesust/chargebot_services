import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { Customer } from "@chargebot-services/core/services/customer";
import auditCreation from "../shared/middlewares/audit-create";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CreateCustomerSchema, CustomerResponseSchema } from "./customer.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any, context: any) => {
    console.log('Request to create Customer:', event, context);
    const customer = await Customer.create(event.body);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: customer
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(jsonBodyParser())
    .use(auditCreation())
    .use(validator({ eventSchema: CreateCustomerSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: CustomerResponseSchema }));