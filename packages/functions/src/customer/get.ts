import middy from "@middy/core";
import validator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import { IdPathParamSchema, JsonResponseSchema } from "../shared/schemas";
import { Customer } from "@chargebot-services/core/services/customer";

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
        body: JSON.stringify(customer),
    };
};

export const main = middy(handler)
    .use(validator({
        eventSchema: IdPathParamSchema,
        responseSchema: JsonResponseSchema
    }))
    .use(httpErrorHandler());