import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { AppInstallArrayResponseSchema } from "./app_install.schema";
import { AppInstall } from "@chargebot-services/core/services/app_install";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const app_installs = await AppInstall.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: app_installs
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: AppInstallArrayResponseSchema }));