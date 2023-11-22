import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { BotScheduledAlerts } from "@chargebot-services/core/services/bot_scheduled_alerts";
import auditCreation from "../shared/middlewares/audit-create";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CreateBotScheduledAlertsSchema, BotScheduledAlertsResponseSchema } from "./bot_scheduled_alerts.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any, context: any) => {
    console.log('Request to create BotScheduledAlerts:', event, context);
    const bot_scheduled_alerts = await BotScheduledAlerts.create(event.body);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: bot_scheduled_alerts
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(jsonBodyParser())
    .use(auditCreation())
    .use(validator({ eventSchema: CreateBotScheduledAlertsSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: BotScheduledAlertsResponseSchema }));