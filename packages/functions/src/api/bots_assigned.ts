import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { ResponseSchema } from "../schemas/chargebot_gps.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import { BotCompany } from "@chargebot-services/core/services/bot_company";
import { Company } from "@chargebot-services/core/services/company";

// @ts-expect-error ignore any type for event
const handler = async ({ requestContext }) => {
    const user_id = requestContext?.authorizer?.jwt.claims.sub;

    let response;

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

        const botsByCompany = await BotCompany.findByCriteria({company_id: company.id});
        if (botsByCompany) {
          response = botsByCompany.map((botCompany) =>
            // @ts-expect-error ignore any type
            new Object.assign(
              {
                "id": botCompany.bot?.id,
                "bot_uuid": botCompany.bot?.bot_uuid,
                "name": botCompany.bot?.name,
                "initials": botCompany.bot?.initials,
                "pin_color": botCompany.bot?.pin_color,
                "bot_version_id": botCompany.bot?.bot_version_id,
              },
              {
                "company_id": botCompany.company?.id,
                "company_name": botCompany.company?.name,
              },
              {
                "customer_id": botCompany.company?.customer?.id,
                "customer_name": botCompany.company?.customer?.name,
              },
            )
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
    .use(validator({ responseSchema: ResponseSchema }))
    // httpErrorHandler must be the last error handler attached, first to execute.
    // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
    .use(httpErrorHandler());