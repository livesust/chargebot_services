import middy from "@middy/core";
import { createError, HttpError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse } from "../shared/rest_utils";
import { Bot } from "@chargebot-services/core/services/bot";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { BotVersion } from "@chargebot-services/core/services/bot_version";
import { EventBus } from "@chargebot-services/core/services/aws/event_bus";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  // payload will come on body when called from API
  // but direct on event when from IoT
  const body = event.body ?? event;

  Log.debug("Echo from bot", { body });

  // bot_uuid from IoT, device_id from API
  const bot_uuid: string = body.bot_uuid ?? body.device_id;
  const device_version = body.device_version;

  try {
    if (!bot_uuid) {
      return createError(400, "bot uuid not provided", { expose: true });
    }

    const bot = await Bot.findOneByCriteria({ bot_uuid })

    if (bot) {
      Log.debug("Bot already registered");
    }

    let botVersion = await BotVersion.findOneByCriteria({version_number: device_version})
    if (!botVersion){
      botVersion = (await BotVersion.create({
        version_number: device_version,
        version_name: `v${device_version}`,
        active_date: new Date(),
      }))!.entity;
    }

    if (!bot) {
      const created = await Bot.create({
        bot_uuid,
        name: bot_uuid,
        initials: bot_uuid.substring(0, 2),
        bot_version_id: botVersion!.id!,
      });
      Log.debug("Dispatch creation event");
      EventBus.dispatchEvent('bot', "created", created?.entity);
    } else {
      await Bot.update(bot.id!, {
        bot_version_id: botVersion!.id!,
      });
    }

    Log.debug("Bot registered", {bot_uuid});

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
  // .use(executionTimeLogger())
  .use(httpEventNormalizer())
  .use(jsonBodyParser({ reviver: dateReviver }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());