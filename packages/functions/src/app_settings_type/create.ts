import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { AppSettingsType } from "@chargebot-services/core/services/app_settings_type";
import auditCreation from "../shared/middlewares/audit-create";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CreateAppSettingsTypeSchema, AppSettingsTypeResponseSchema } from "./app_settings_type.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any, context: any) => {
    console.log('Request to create AppSettingsType:', event, context);
    const app_settings_type = await AppSettingsType.create(event.body);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: app_settings_type
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(jsonBodyParser())
    .use(auditCreation())
    .use(validator({ eventSchema: CreateAppSettingsTypeSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: AppSettingsTypeResponseSchema }));