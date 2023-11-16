import middy from "@middy/core";
import validator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import { IdPathParamSchema, JsonResponseSchema } from "../shared/schemas";
import { Bot } from "@chargebot-services/core/services/bot";

const handler = async (event: any) => {
    const bot = await Bot.get(+event.pathParameters!.id!);

    if (!bot) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" }
        };
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bot),
    };
};

export const main = middy(handler)
    .use(validator({
        eventSchema: IdPathParamSchema,
        responseSchema: JsonResponseSchema
    }))
    .use(httpErrorHandler());