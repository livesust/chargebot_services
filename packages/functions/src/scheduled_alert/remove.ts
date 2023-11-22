import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import { IdPathParamSchema, SuccessResponseSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { ScheduledAlert } from "@chargebot-services/core/services/scheduled_alert";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const id = +event.pathParameters!.id!;
    const user_id = event.requestContext?.authorizer?.jwt.claims.sub;
    const deleted = await ScheduledAlert.remove(id, user_id);

    // @ts-ignore
    if (!deleted) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" }
        };
    }
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: { "response": "success" },
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(validator({ eventSchema: IdPathParamSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: SuccessResponseSchema }));