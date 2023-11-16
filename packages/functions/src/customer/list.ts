import middy from "@middy/core";
import validator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import { JsonResponseSchema } from "../shared/schemas";
import { Customer } from "@chargebot-services/core/services/customer";

const handler = async (event: any) => {
    const customers = await Customer.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customers)
    };
    return response;
};

export const main = middy(handler)
    .use(validator({ responseSchema: JsonResponseSchema }))
    .use(httpErrorHandler());