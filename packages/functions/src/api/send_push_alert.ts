import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError, HttpError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { EntitySchema } from "../schemas/send_push_alert.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { Bot } from "@chargebot-services/core/services/bot";
import { BotUser } from "@chargebot-services/core/services/bot_user";
import { AppInstall } from "@chargebot-services/core/services/app_install";
import { SuccessResponseSchema } from "src/shared/schemas";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { ExpoPush } from "@chargebot-services/core/services/expo/expo_push";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  console.log('SEND ALERT EVENT: ', event);
  const body = event.body;
  const bot_uuid = body.bot_uuid ?? body.device_id;

  try {
    if (!bot_uuid) {
      return createError(400, "bot uuid not provided", { expose: true });
    }

    const bot = await Bot.findOneByCriteria({ bot_uuid })

    if (!bot) {
      return createNotFoundResponse({ "response": "bot not found" });
    }

    const usersByBot = await BotUser.findByCriteria({ bot_id: bot.id });
    const user_ids = usersByBot.map(ub => ub.user_id);
    const appInstalls = await AppInstall.getAppsToNotify(user_ids);

    const pushTokens = appInstalls?.map(ai => ai.push_token!);
    
    if (pushTokens && pushTokens.length > 0) {
      ExpoPush.send_push_notifications(pushTokens, body.message, body.name, {bot_uuid, bot_id: bot.id})
    }

    return createSuccessResponse({ "response": "success" });

  } catch (error) {
    Log.error("ERROR", { error });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot send alert", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(jsonBodyParser({ reviver: dateReviver }))
  .use(validator({ eventSchema: EntitySchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: SuccessResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());