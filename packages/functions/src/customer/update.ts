import middy from "@middy/core";
import validator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { JsonResponseSchema } from "../shared/schemas";
import { UpdateCustomerSchema } from "./customer.schema";
import { Customer } from "@chargebot-services/core/services/customer";

const handler = async (event: any) => {
    const id = +event.pathParameters!.id!;
    const user_id = event.requestContext.authorizer.jwt.claims.sub;
    const customer = await Customer.update(id, event.body, user_id);

    if (!customer) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" }
        };
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
    };
};

export const main = middy(handler)
    .use(jsonBodyParser())
    .use(validator({
        eventSchema: UpdateCustomerSchema,
        responseSchema: JsonResponseSchema
    }))
    .use(httpErrorHandler());