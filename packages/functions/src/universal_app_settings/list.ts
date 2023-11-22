import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { UniversalAppSettingsArrayResponseSchema } from "./universal_app_settings.schema";
import { UniversalAppSettings } from "@chargebot-services/core/services/universal_app_settings";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const universal_app_settingss = await UniversalAppSettings.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: universal_app_settingss
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: UniversalAppSettingsArrayResponseSchema }));