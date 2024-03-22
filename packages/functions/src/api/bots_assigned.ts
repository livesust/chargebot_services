import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { ArrayResponseSchema } from "../schemas/bot_assigned.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import Log from '@dazn/lambda-powertools-logger';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { BotUser } from "@chargebot-services/core/services/bot_user";
import { ChargebotBattery } from "@chargebot-services/core/services/analytics/chargebot_battery";
import { ChargebotInverter } from "@chargebot-services/core/services/analytics/chargebot_inverter";

// @ts-expect-error ignore any type for event
const handler = async ({ requestContext }) => {
  const user_id = requestContext?.authorizer?.jwt.claims.sub;

  const response: unknown[] = [];

  console.log('GET Bots Assigned', user_id);

  try {
    const botsByUser = await BotUser.findBotsByUser(user_id);

    if (botsByUser?.length === 0) {
      Log.warn('User bots not found');
      throw createError(404, "user bots not found", { expose: true });
    }

    if (botsByUser) {
      const uuids = botsByUser.map(b => b.bot!.bot_uuid);
      const [levels, status] = await Promise.all([
        ChargebotBattery.getBatteryLevels(uuids),
        ChargebotInverter.getBatteryStatuses(uuids)
      ]);
      for (const botUser of botsByUser) {
        const bot = botUser.bot!;

        response.push({
          "id": bot.id,
          "bot_uuid": bot.bot_uuid,
          "name": bot.name,
          "initials": bot.initials,
          "pin_color": bot.pin_color,
          "battery_level": levels?.find(l => l?.bot_uuid === bot.bot_uuid)?.level,
          "battery_status": status?.find(l => l?.bot_uuid === bot.bot_uuid)?.status
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
  .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ArrayResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());
