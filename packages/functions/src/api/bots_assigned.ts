import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { ArrayResponseSchema } from "../schemas/bots_assigned.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import { BotCompany } from "@chargebot-services/core/services/bot_company";
import { BotUser } from "@chargebot-services/core/services/bot_user";
import { Company } from "@chargebot-services/core/services/company";
import { Customer } from "@chargebot-services/core/services/customer";

// @ts-expect-error ignore any type for event
const handler = async ({ requestContext }) => {
    const user_id = requestContext?.authorizer?.jwt.claims.sub;

    const response: unknown[] = [];

    try {
        const users = await User.findByCriteria({user_id: user_id});
        if (users?.length == 0) {
          throw Error("User not found");
        }
        const user = users[0];
        
        const company = await Company.get(user.company_id);
        if (!company) {
          throw Error("User's company not found");
        }
        
        const customer = await Customer.get(company.customer_id);
        if (!customer) {
          throw Error("User's customer not found");
        }

        const botUsers = await BotUser.findByCriteria({user_id: user.id});
        if (botUsers) {
          botUsers.forEach(({bot}) =>
            response.push({
              "id": bot?.id,
              "bot_uuid": bot?.bot_uuid,
              "name": bot?.name,
              "initials": bot?.initials,
              "pin_color": bot?.pin_color,
              "company_id": company.id,
              "company_name": company.name,
              "customer_id": customer?.id,
              "customer_name": customer?.name,
            })
          )
        }
    } catch (error) {
        const httpError = createError(500, "cannot query bots for user", { expose: true });
        httpError.details = (<Error>error).message;
        throw httpError;
    }
    return createSuccessResponse(response);
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: ArrayResponseSchema }))
    // httpErrorHandler must be the last error handler attached, first to execute.
    // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
    .use(httpErrorHandler());