import middy from "@middy/core";
import validator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import { JsonResponseSchema } from "../shared/schemas";
import { SearchBotSchema } from "./bot.schema";
import { Bot } from "@chargebot-services/core/services/bot";
import jsonBodyParser from "@middy/http-json-body-parser";

const handler = async (event: any) => {
    const bots = await Bot.findByCriteria(event.body);
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
        eventSchema: SearchBotSchema,
        responseSchema: JsonResponseSchema
    }))
    .use(httpErrorHandler());