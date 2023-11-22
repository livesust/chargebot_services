import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { UniversalAppSettingsArrayResponseSchema } from "./universal_app_settings.schema";
import { UniversalAppSettings } from "@chargebot-services/core/services/universal_app_settings";
import { SearchUniversalAppSettingsSchema } from "./universal_app_settings.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const universal_app_settingss = await UniversalAppSettings.findByCriteria(event.body);
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
    .use(jsonBodyParser())
    .use(validator({ eventSchema: SearchUniversalAppSettingsSchema}))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: UniversalAppSettingsArrayResponseSchema }));