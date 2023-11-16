import middy from "@middy/core";
import validator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import { JsonResponseSchema } from "../shared/schemas";
import { SearchCustomerSchema } from "./customer.schema";
import { Customer } from "@chargebot-services/core/services/customer";
import jsonBodyParser from "@middy/http-json-body-parser";

const handler = async (event: any) => {
    const bots = await Customer.findByCriteria(event.body);
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bots)
    };
    return response;
};

export const main = middy(handler)
    .use(jsonBodyParser())
    .use(validator({
        eventSchema: SearchCustomerSchema,
        responseSchema: JsonResponseSchema
    }))
    .use(httpErrorHandler());