import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { UserPhoneArrayResponseSchema } from "./user_phone.schema";
import { UserPhone } from "@chargebot-services/core/services/user_phone";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const user_phones = await UserPhone.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: user_phones
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: UserPhoneArrayResponseSchema }));