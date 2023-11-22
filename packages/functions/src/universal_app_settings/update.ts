import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { UniversalAppSettings } from "@chargebot-services/core/services/universal_app_settings";
import auditUpdate from "../shared/middlewares/audit-update";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { UpdateUniversalAppSettingsSchema, UniversalAppSettingsResponseSchema } from "./universal_app_settings.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const id = +event.pathParameters!.id!;
    const universal_app_settings = await UniversalAppSettings.update(id, event.body);

    if (!universal_app_settings) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" }
        };
    }

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
    .use(auditUpdate())
    .use(validator({ eventSchema: UpdateUniversalAppSettingsSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: UniversalAppSettingsResponseSchema }));