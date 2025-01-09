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
import { BotFirmwareVersion } from "@chargebot-services/core/services/bot_firmware_version";
import { BotFirmwareInstall } from "@chargebot-services/core/services/bot_firmware_install";
import { EventBus } from "@chargebot-services/core/services/aws/event_bus";
import { BotModel } from "@chargebot-services/core/services/bot_model";
import { BotStatus } from "@chargebot-services/core/services/bot_status";

export const processBotDiscovery = async (bot_uuid: string, device_version: string) => {
  try {
    if (!bot_uuid) {
      return createError(400, "bot uuid not provided", { expose: true });
    }

    const [bot, botModel, botStatus] = await Promise.all([
      Bot.findOneByCriteria({ bot_uuid }),
      BotModel.findOneByCriteria({name: 'Trailblazer'}),
      BotStatus.findOneByCriteria({name: 'Arrived Facility'})
    ])

    let botFirmwareVersion = await BotFirmwareVersion.findOneByCriteria({version_number: device_version})
    if (!botFirmwareVersion){
      // Create the new Bot Firmware Version
      botFirmwareVersion = (await BotFirmwareVersion.create({
        version_number: device_version,
        version_name: `v${device_version}`,
        active_date: new Date(),
      }))!.entity;
    }

    if (!bot) {
      // Create the new Bot
      const botCreated = await Bot.create({
        bot_uuid,
        name: bot_uuid,
        initials: bot_uuid.substring(0, 2),
        bot_model_id: botModel?.id,
        bot_status_id: botStatus?.id,
      });
      // Associate the version
      await BotFirmwareInstall.create({
        install_date: new Date(),
        active: true,
        bot_id: botCreated!.entity!.id!,
        bot_firmware_version_id: botFirmwareVersion!.id!
      });
      EventBus.dispatchEvent('bot', "created", botCreated?.entity);
    } else {
      // Search if this version is already associated to bot
      const existentInstall = await BotFirmwareInstall.findOneByCriteria({
        bot_id: bot.id,
        bot_firmware_version_id: botFirmwareVersion!.id!
      })
      if (existentInstall?.bot_firmware_version?.version_number !== device_version) {
        // This version is not associated to bot
        // mark others installs as inactive
        (await BotFirmwareInstall.findByCriteria({bot_id: bot.id!})).map(async (bfi) => {
          return await BotFirmwareInstall.update(bfi.id!, {active: false})
        });
        // associate new version as active
        await BotFirmwareInstall.create({
          install_date: new Date(),
          active: true,
          bot_id: bot.id!,
          bot_firmware_version_id: botFirmwareVersion!.id!
        });
      }
      EventBus.dispatchEvent('bot', "created", bot);
    }

    return createSuccessResponse({ "response": "success" });

  } catch (error) {
    Log.error("ERROR", { error });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot discover bot", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
}

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  // payload will come on body when called from API
  // but direct on event when from IoT
  const body = event.body ?? event;

  // bot_uuid from IoT, device_id from API
  const bot_uuid: string = body.bot_uuid ?? body.device_id;
  const device_version = body.device_version;

  return await processBotDiscovery(bot_uuid, device_version);
};

export const main = middy(handler)
  // before
  // .use(executionTimeLogger())
  .use(httpEventNormalizer())
  .use(jsonBodyParser({ reviver: dateReviver }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());