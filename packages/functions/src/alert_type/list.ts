import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { AlertTypeArrayResponseSchema } from "./alert_type.schema";
import { AlertType } from "@chargebot-services/core/services/alert_type";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const alert_types = await AlertType.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: alert_types
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: AlertTypeArrayResponseSchema }));