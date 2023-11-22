import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { UserRoleArrayResponseSchema } from "./user_role.schema";
import { UserRole } from "@chargebot-services/core/services/user_role";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const user_roles = await UserRole.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: user_roles
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: UserRoleArrayResponseSchema }));