import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { BotScheduledAlertsArrayResponseSchema } from "./bot_scheduled_alerts.schema";
import { BotScheduledAlerts } from "@chargebot-services/core/services/bot_scheduled_alerts";
import { SearchBotScheduledAlertsSchema } from "./bot_scheduled_alerts.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const bot_scheduled_alertss = await BotScheduledAlerts.findByCriteria(event.body);
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
    .use(jsonBodyParser())
    .use(validator({ eventSchema: SearchBotScheduledAlertsSchema}))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: BotScheduledAlertsArrayResponseSchema }));