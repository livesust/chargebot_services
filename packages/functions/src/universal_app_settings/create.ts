import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { UniversalAppSettings } from "@chargebot-services/core/services/universal_app_settings";
import auditCreation from "../shared/middlewares/audit-create";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CreateUniversalAppSettingsSchema, UniversalAppSettingsResponseSchema } from "./universal_app_settings.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any, context: any) => {
    console.log('Request to create UniversalAppSettings:', event, context);
    const universal_app_settings = await UniversalAppSettings.create(event.body);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: universal_app_settings
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(jsonBodyParser())
    .use(auditCreation())
    .use(validator({ eventSchema: CreateUniversalAppSettingsSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: UniversalAppSettingsResponseSchema }));