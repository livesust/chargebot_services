import middy from "@middy/core";
import validator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import { IdPathParamSchema, JsonResponseSchema } from "../shared/schemas";
import { Bot } from "@chargebot-services/core/services/bot";

const handler = async (event: any) => {
    const id = +event.pathParameters!.id!;
    const user_id = event.requestContext.authorizer.jwt.claims.sub;
    const deleted = await Bot.remove(id, user_id);

    // @ts-ignore
    if (!deleted) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" }
        };
    }
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "response": "success" }),
    };
};

export const main = middy(handler)
    .use(validator({
        eventSchema: IdPathParamSchema,
        responseSchema: JsonResponseSchema
    }))
    .use(httpErrorHandler());