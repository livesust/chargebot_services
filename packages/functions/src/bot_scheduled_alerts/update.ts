import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { BotScheduledAlerts } from "@chargebot-services/core/services/bot_scheduled_alerts";
import auditUpdate from "../shared/middlewares/audit-update";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { UpdateBotScheduledAlertsSchema, BotScheduledAlertsResponseSchema } from "./bot_scheduled_alerts.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const id = +event.pathParameters!.id!;
    const bot_scheduled_alerts = await BotScheduledAlerts.update(id, event.body);

    if (!bot_scheduled_alerts) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" }
        };
    }

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
    .use(auditUpdate())
    .use(validator({ eventSchema: UpdateBotScheduledAlertsSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: BotScheduledAlertsResponseSchema }));