import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { AppInstallPermissionsArrayResponseSchema } from "./app_install_permissions.schema";
import { AppInstallPermissions } from "@chargebot-services/core/services/app_install_permissions";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const app_install_permissionss = await AppInstallPermissions.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: app_install_permissionss
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: AppInstallPermissionsArrayResponseSchema }));