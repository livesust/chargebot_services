import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { BotScheduledAlertsArrayResponseSchema } from "./bot_scheduled_alerts.schema";
import { BotScheduledAlerts } from "@chargebot-services/core/services/bot_scheduled_alerts";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const bot_scheduled_alertss = await BotScheduledAlerts.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: bot_scheduled_alertss
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: BotScheduledAlertsArrayResponseSchema }));