import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { ScheduledAlert } from "@chargebot-services/core/services/scheduled_alert";
import auditCreation from "../shared/middlewares/audit-create";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CreateScheduledAlertSchema, ScheduledAlertResponseSchema } from "./scheduled_alert.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any, context: any) => {
    console.log('Request to create ScheduledAlert:', event, context);
    const scheduled_alert = await ScheduledAlert.create(event.body);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: scheduled_alert
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(jsonBodyParser())
    .use(auditCreation())
    .use(validator({ eventSchema: CreateScheduledAlertSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: ScheduledAlertResponseSchema }));