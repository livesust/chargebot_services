import middy from "@middy/core";
import validator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { JsonResponseSchema } from "../shared/schemas";
import { CreateBotSchema } from "./bot.schema";
import { Bot } from "@chargebot-services/core/services/bot";

/**
 * CREATE
 */
const handler = async (event: any, context: any) => {
    console.log('Request to create Bot:', event, context);
    const user_id = event.requestContext.authorizer.jwt.claims.sub;
    const bot = await Bot.create(event.body, user_id);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bot)
    };
};

export const main = middy(handler)
    .use(jsonBodyParser())
    .use(validator({
        eventSchema: CreateBotSchema,
        responseSchema: JsonResponseSchema
    }))
    .use(httpErrorHandler());