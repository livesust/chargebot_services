import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { IoTData } from "@chargebot-services/core/services/aws/iot_data";
import { BotUUIDPathParamSchema, JsonResponseSchemaDef } from "src/shared/schemas";
import Joi from "joi";
import { BotShadowConfigSchema } from "src/schemas/bot_shadow_config.schema";
import jsonBodyParser from "@middy/http-json-body-parser";
import { DateTime } from 'luxon';
import { BotScheduledAlert } from "@chargebot-services/core/services/bot_scheduled_alert";
import { Bot } from "@chargebot-services/core/services/bot";
import { ScheduledAlertName } from "@chargebot-services/core/database/scheduled_alert";

// @ts-expect-error ignore any type for event
export const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;
  const body = event.body;
  const alertConfigs = body.config.alerts;

  Log.debug('Now is', {date: new Date()});
  Log.debug('Set shadow configs for', {bot_uuid});

  try {
    const bot = await Bot.findOneByCriteria({bot_uuid});

    if (!bot) {
      Log.info("Bot not found");
      return createNotFoundResponse({ "response": "bot not found" });
    }

    const botScheduledAlerts = await BotScheduledAlert.findByCriteria({bot_id: bot.id!});
    botScheduledAlerts.forEach(async bsa => {
      const update = {
        alert_status: true,
        settings: {}
      };
      if (bsa.scheduled_alert?.name === ScheduledAlertName.NOT_PLUGGED_IN) {
        update.alert_status = alertConfigs.not_plugged_in.enabled;
        update.settings = {
          ...bsa.settings,
          time: alertConfigs.not_plugged_in.time_to_send,
          timezone: alertConfigs.not_plugged_in.timezone
        };
      }
      if (bsa.scheduled_alert?.name === ScheduledAlertName.DAILY_USE) {
        update.alert_status = alertConfigs.daily_use.enabled;
        update.settings = {
          ...bsa.settings,
          time: alertConfigs.daily_use.time_to_send,
          timezone: alertConfigs.daily_use.timezone
        };
      }
      if (bsa.scheduled_alert?.name === ScheduledAlertName.NOTHING_CHARGING) {
        update.alert_status = alertConfigs.nothing_charging.enabled;
        update.settings = {
          ...bsa.settings,
          time: alertConfigs.nothing_charging.time_to_send,
          timezone: alertConfigs.nothing_charging.timezone
        };
      }
      if (bsa.scheduled_alert?.name === ScheduledAlertName.BATTERY_LOW) {
        update.alert_status = alertConfigs.battery.soc_low;
      }
      if (bsa.scheduled_alert?.name === ScheduledAlertName.ARRIVE_HOME) {
        update.alert_status = alertConfigs.arrive_home;
      }
      if (bsa.scheduled_alert?.name === ScheduledAlertName.LEAVE_HOME) {
        update.alert_status = alertConfigs.leave_home;
      }
      if (bsa.scheduled_alert?.name === ScheduledAlertName.LONG_STOP) {
        update.alert_status = alertConfigs.long_stop.enabled;
        update.settings = {
          ...bsa.settings,
          time_period: alertConfigs.long_stop.time_period_hours
        };
      }
      await BotScheduledAlert.update(bsa.id!, update);
    });
    
    const timeZone = alertConfigs.not_plugged_in.timezone;
    const configs = {
      ...(body.config),
      alerts: {
        ...(alertConfigs),
        not_plugged_in: {
          enabled: alertConfigs.not_plugged_in.enabled,
          time_to_send: DateTime.fromISO(`${DateTime.now()
            .toFormat('yyyy-MM-dd')}T${alertConfigs.not_plugged_in.time_to_send}`, { zone: timeZone })
            .toUTC()
            .toFormat("HH:mm"),
          timezone: 'UTC'
        },
        daily_use: {
          enabled: alertConfigs.not_plugged_in.enabled,
          time_to_send: DateTime.fromISO(`${DateTime.now()
            .toFormat('yyyy-MM-dd')}T${alertConfigs.daily_use.time_to_send}`, { zone: timeZone })
            .toUTC()
            .toFormat("HH:mm"),
          timezone: 'UTC'
        },
        nothing_charging: {
          enabled: alertConfigs.not_plugged_in.enabled,
          time_to_send: DateTime.fromISO(`${DateTime.now()
            .toFormat('yyyy-MM-dd')}T${alertConfigs.nothing_charging.time_to_send}`, { zone: timeZone })
            .toUTC()
            .toFormat("HH:mm"),
          timezone: 'UTC'
        }
      }
    }
    const [
        systemStatus, configStatus, inverterStatus
    ] = await Promise.all([
      IoTData.updateShadowStatus(bot_uuid, 'system', body.system),
      IoTData.updateShadowStatus(bot_uuid, 'config', configs),
      IoTData.updateShadowStatus(bot_uuid, 'inverter', body.inverter),
    ]);

    Log.debug('Shadow configs set');

    const response = {
      system: systemStatus?.state?.desired ?? systemStatus?.state?.reported,
      config: configStatus?.state?.desired ?? configStatus?.state?.reported,
      inverter: inverterStatus?.state?.desired ?? inverterStatus?.state?.reported,
    };

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    // create and throw database errors
    const httpError = createError(406, "cannot query bot status", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  // .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(jsonBodyParser())
  .use(validator({
    pathParametersSchema: BotUUIDPathParamSchema,
    eventSchema: BotShadowConfigSchema
  }))
  // after: inverse order execution
  .use(jsonBodySerializer(false))
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: Joi.object({
      ...JsonResponseSchemaDef,
      body: BotShadowConfigSchema
    })    
  }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());
