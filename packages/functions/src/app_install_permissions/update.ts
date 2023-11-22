import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { AppInstallPermissions } from "@chargebot-services/core/services/app_install_permissions";
import auditUpdate from "../shared/middlewares/audit-update";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { UpdateAppInstallPermissionsSchema, AppInstallPermissionsResponseSchema } from "./app_install_permissions.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const id = +event.pathParameters!.id!;
    const app_install_permissions = await AppInstallPermissions.update(id, event.body);

    if (!app_install_permissions) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" }
        };
    }

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
    .use(auditUpdate())
    .use(validator({ eventSchema: UpdateAppInstallPermissionsSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: AppInstallPermissionsResponseSchema }));