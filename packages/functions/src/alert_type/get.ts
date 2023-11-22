import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import { AlertType } from "@chargebot-services/core/services/alert_type";
import { IdPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { AlertTypeResponseSchema } from "./alert_type.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const alert_type = await AlertType.get(+event.pathParameters!.id!);

    if (!alert_type) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" }
        };
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: alert_type,
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(validator({ eventSchema: IdPathParamSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: AlertTypeResponseSchema }));