import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { ArrayResponseSchema } from "../schemas/bot_assigned.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import { BotUser } from "@chargebot-services/core/services/bot_user";
import { Company } from "@chargebot-services/core/services/company";
import { ChargebotBattery } from "@chargebot-services/core/services/analytics/chargebot_battery";
import { ChargebotInverter } from "@chargebot-services/core/services/analytics/chargebot_inverter";

// @ts-expect-error ignore any type for event
const handler = async ({ requestContext }) => {
    const user_id = requestContext?.authorizer?.jwt.claims.sub;

    const response: unknown[] = [];

    try {
        const users = await User.findByCriteria({user_id: user_id});
        if (users?.length == 0) {
          throw createError(404, "user not found", { expose: true });
        }
        const user = users[0];
        
        const [company, botsByUser] = await Promise.all([
            Company.get(user.company_id),
            BotUser.findByCriteria({ user_id: user.id }),
        ]);

        if (!company) {
            throw createError(404, "user's company not found", { expose: true });
        }
    
        if (botsByUser) {
          for (const botUser of botsByUser) {
            const bot = botUser.bot!;
            const [battery_level, battery_status] = await Promise.all([
              ChargebotBattery.getBatteryLevel(bot.bot_uuid),
              ChargebotInverter.getBatteryStatus(bot.bot_uuid)
            ]);

            response.push({
              "id": bot.id,
              "bot_uuid": bot.bot_uuid,
              "name": bot.name,
              "initials": bot.initials,
              "pin_color": bot.pin_color,
              "battery_level": battery_level,
              "battery_status": battery_status,
              "company_id": company.id,
              "company_name": company.name,
              "customer_id": company.customer?.id,
              "customer_name": company.customer?.name,
            });
          }
        }
    } catch (error) {
        if (error instanceof HttpError) {
          // re-throw when is a http error generated above
          throw error;
        }

        // create and throw database errors
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
