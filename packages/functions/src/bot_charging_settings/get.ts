import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import { BotChargingSettings } from "@chargebot-services/core/services/bot_charging_settings";
import { IdPathParamSchema } from "../shared/schemas";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { BotChargingSettingsResponseSchema } from "./bot_charging_settings.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const bot_charging_settings = await BotChargingSettings.get(+event.pathParameters!.id!);

    if (!bot_charging_settings) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" }
        };
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: bot_charging_settings,
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(validator({ eventSchema: IdPathParamSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: BotChargingSettingsResponseSchema }));