import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import { Bot } from "@chargebot-services/core/services/bot";
import { IdPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { BotResponseSchema } from "./bot.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

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
        body: bot,
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(validator({ eventSchema: IdPathParamSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: BotResponseSchema }));