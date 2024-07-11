import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { ArrayResponseSchema } from "../schemas/bot_assigned.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import Log from '@dazn/lambda-powertools-logger';
import { createSuccessResponse, getNumber, isWarmingUp } from "../shared/rest_utils";
import { ChargebotBattery, translateBatteryState } from "@chargebot-services/core/services/analytics/chargebot_battery";
import { Bot } from "@chargebot-services/core/services/bot";
import { Company } from "@chargebot-services/core/services/company";
import { User } from "@chargebot-services/core/services/user";
import { BatteryVariables } from "@chargebot-services/core/timescale/chargebot_battery";

// @ts-expect-error ignore any type for event
const handler = async ({ requestContext }) => {
  const user_id = requestContext?.authorizer?.jwt.claims.sub;

  const response: unknown[] = [];

  console.log('GET Bots Assigned', user_id);

  try {
    const [botsByUser, user] = await Promise.all([Bot.findBotsByUser(user_id), User.lazyFindOneByCriteria({ user_id: user_id })]);

    if (!user) {
      Log.warn('User not found');
      throw createError(404, "user not found", { expose: true });
    }

    const company = await Company.get(user.company_id);

    if (botsByUser?.length === 0) {
      Log.warn('User bots not found');
      throw createError(404, "user bots not found", { expose: true });
    }

    if (botsByUser) {
      const bot_uuids = botsByUser.map(b => b.bot_uuid);
      const batteryStatus = await ChargebotBattery.getBatteryStatuses(bot_uuids);
      for (const bot of botsByUser) {
        const batteryVariables: { [key: string]: unknown } = batteryStatus?.filter(l => l?.device_id === bot.bot_uuid)
          .reduce((acc: { [key: string]: unknown }, obj) => {
            acc[obj.variable] = obj.value;
            return acc;
          }, {});
        response.push({
          "id": bot.id,
          "bot_uuid": bot.bot_uuid,
          "name": bot.name,
          "initials": bot.initials,
          "pin_color": bot.pin_color,
          "battery_level": getNumber(batteryVariables[BatteryVariables.LEVEL_SOC]),
          "battery_status": translateBatteryState(batteryVariables[BatteryVariables.STATE] as number),
          "company_id": company?.id,
          "company_name": company?.name,
          "customer_id": company?.customer?.id,
          "customer_name": company?.customer?.name,
        });
      }
    }
  } catch (error) {
    Log.error("ERROR", { error });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }

    // create and throw database errors
    const httpError = createError(406, "cannot query bots for user", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
  return createSuccessResponse(response);
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  // .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ArrayResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());
