import middy from "@middy/core";
import validator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { JsonResponseSchema } from "../shared/schemas";
import { CreateCustomerSchema } from "./customer.schema";
import { Customer } from "@chargebot-services/core/services/customer";

/**
 * CREATE
 */
const handler = async (event: any, context: any) => {
    console.log('Request to create Customer:', event, context);
    const user_id = event.requestContext.authorizer.jwt.claims.sub;
    const customer = await Customer.create(event.body, user_id);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
    };
};

export const main = middy(handler)
    .use(jsonBodyParser())
    .use(validator({
        eventSchema: CreateCustomerSchema,
        responseSchema: JsonResponseSchema
    }))
    .use(httpErrorHandler());