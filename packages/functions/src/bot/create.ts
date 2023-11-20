import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { Bot } from "@chargebot-services/core/services/bot";
import auditCreation from "../shared/middlewares/audit-create";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CreateBotSchema, BotResponseSchema } from "./bot.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any, context: any) => {
    console.log('Request to create Bot:', event, context);
    const bot = await Bot.create(event.body);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: bot
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(jsonBodyParser())
    .use(auditCreation())
    .use(validator({ eventSchema: CreateBotSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: BotResponseSchema }));