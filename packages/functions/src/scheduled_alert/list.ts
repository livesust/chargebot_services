import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { ScheduledAlertArrayResponseSchema } from "./scheduled_alert.schema";
import { ScheduledAlert } from "@chargebot-services/core/services/scheduled_alert";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const scheduled_alerts = await ScheduledAlert.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: scheduled_alerts
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: ScheduledAlertArrayResponseSchema }));