import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { UserEmail } from "@chargebot-services/core/services/user_email";
import auditUpdate from "../shared/middlewares/audit-update";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { UpdateUserEmailSchema, UserEmailResponseSchema } from "./user_email.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const id = +event.pathParameters!.id!;
    const user_email = await UserEmail.update(id, event.body);

    if (!user_email) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" }
        };
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: user_email
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(jsonBodyParser())
    .use(auditUpdate())
    .use(validator({ eventSchema: UpdateUserEmailSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: UserEmailResponseSchema }));