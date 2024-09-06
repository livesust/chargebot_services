import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { Bot } from "@chargebot-services/core/services/bot";
import { IoTData } from "@chargebot-services/core/services/aws/iot_data";
import { ScheduledAlertName } from "@chargebot-services/core/database/scheduled_alert";
import { DateTime } from 'luxon';
import { ScheduledAlert } from "@chargebot-services/core/services/scheduled_alert";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_scheduled_alert = event?.detail;
  if(bot_scheduled_alert?.id) {
    /*
    When a scheduled_alert is created/updated, we must:
      - call to update device shadow with alert configs
    */
    const [bot, scheduled_alert] = await Promise.all([Bot.get(bot_scheduled_alert?.bot_id), ScheduledAlert.get(bot_scheduled_alert?.scheduled_alert_id)]);

    if (!bot) {
      Log.info("Bot not found");
      return createNotFoundResponse({ "response": "bot not found" });
    }

    if (!scheduled_alert) {
      Log.info("Scheduled Alert not found");
      return createNotFoundResponse({ "response": "scheduled alert not found" });
    }

    const configShadow = await IoTData.getShadowStatus(bot.bot_uuid, 'config');
    const config = configShadow?.state?.desired ?? configShadow?.state?.reported;
    const settings = bot_scheduled_alert.settings;
    if (scheduled_alert.name === ScheduledAlertName.NOT_PLUGGED_IN) {
      const timeToSend = DateTime.fromISO(`${DateTime.now()
        .toFormat('yyyy-MM-dd')}T${settings.time}`, { zone: settings.timezone })
        .toUTC()
        .toFormat("HH:mm");
      config.alerts.not_plugged_in = {
        enabled: bot_scheduled_alert.alert_status,
        time_to_send: timeToSend,
        timezone: 'UTC'
      }
    } else if (scheduled_alert.name === ScheduledAlertName.DAILY_USE) {
      const timeToSend = DateTime.fromISO(`${DateTime.now()
        .toFormat('yyyy-MM-dd')}T${settings.time}`, { zone: settings.timezone })
        .toUTC()
        .toFormat("HH:mm");
      config.alerts.daily_use = {
        enabled: bot_scheduled_alert.alert_status,
        time_to_send: timeToSend,
        timezone: 'UTC'
      }
    } else if (scheduled_alert.name === ScheduledAlertName.NOTHING_CHARGING) {
      const timeToSend = DateTime.fromISO(`${DateTime.now()
        .toFormat('yyyy-MM-dd')}T${settings.time}`, { zone: settings.timezone })
        .toUTC()
        .toFormat("HH:mm");
      config.alerts.nothing_charging = {
        enabled: bot_scheduled_alert.alert_status,
        time_to_send: timeToSend,
        timezone: 'UTC'
      }
    } else if (scheduled_alert.name === ScheduledAlertName.LONG_STOP) {
      config.alerts.long_stop = {
        enabled: bot_scheduled_alert.alert_status,
        time_period_hours: settings.time
      }
    } else if (scheduled_alert.name === ScheduledAlertName.ARRIVE_HOME) {
      config.alerts.arrive_home = bot_scheduled_alert.alert_status;
    } else if (scheduled_alert.name === ScheduledAlertName.LEAVE_HOME) {
      config.alerts.leave_home = bot_scheduled_alert.alert_status;
    } else if (scheduled_alert.name === ScheduledAlertName.BATTERY_LOW) {
      config.alerts.battery.soc_low = bot_scheduled_alert.alert_status;
      config.alerts.battery.soc_critical = bot_scheduled_alert.alert_status;
      config.alerts.battery.temperature_celcius_low = bot_scheduled_alert.alert_status;
      config.alerts.battery.temperature_celcius_critical = bot_scheduled_alert.alert_status;
    }
    await IoTData.updateShadowStatus(bot.bot_uuid, 'config', config);
    Log.debug('Shadow configs set', {configShadow});
  }

  return createSuccessResponse({ "response": "success" });
};

export const main = middy(handler).use(warmup({ isWarmingUp }));