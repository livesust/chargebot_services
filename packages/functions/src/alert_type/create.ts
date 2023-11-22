import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { AlertType } from "@chargebot-services/core/services/alert_type";
import auditCreation from "../shared/middlewares/audit-create";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CreateAlertTypeSchema, AlertTypeResponseSchema } from "./alert_type.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any, context: any) => {
    console.log('Request to create AlertType:', event, context);
    const alert_type = await AlertType.create(event.body);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: alert_type
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(jsonBodyParser())
    .use(auditCreation())
    .use(validator({ eventSchema: CreateAlertTypeSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: AlertTypeResponseSchema }));