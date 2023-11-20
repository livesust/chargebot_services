import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { BotArrayResponseSchema } from "./bot.schema";
import { Bot } from "@chargebot-services/core/services/bot";
import { SearchBotSchema } from "./bot.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const bots = await Bot.findByCriteria(event.body);
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: bots
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(jsonBodyParser())
    .use(validator({ eventSchema: SearchBotSchema}))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: BotArrayResponseSchema }));