import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { AppInstallPermissions } from "@chargebot-services/core/services/app_install_permissions";
import auditCreation from "../shared/middlewares/audit-create";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CreateAppInstallPermissionsSchema, AppInstallPermissionsResponseSchema } from "./app_install_permissions.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any, context: any) => {
    console.log('Request to create AppInstallPermissions:', event, context);
    const app_install_permissions = await AppInstallPermissions.create(event.body);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: app_install_permissions
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(jsonBodyParser())
    .use(auditCreation())
    .use(validator({ eventSchema: CreateAppInstallPermissionsSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: AppInstallPermissionsResponseSchema }));