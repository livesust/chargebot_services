import Log from '@dazn/lambda-powertools-logger';
import { BotScheduledAlert } from '@chargebot-services/core/services/bot_scheduled_alert';
import { ScheduledAlertName } from '@chargebot-services/core/database/scheduled_alert';
import { createSuccessResponse } from 'src/shared/rest_utils';
import { DateTime } from 'luxon';
import i18n from '../shared/i18n/i18n';
import { BotUser } from '@chargebot-services/core/services/bot_user';
import { AppInstall } from '@chargebot-services/core/services/app_install';
import { ExpoPush } from '@chargebot-services/core/services/expo/expo_push';
import { ChargebotInverter } from '@chargebot-services/core/services/analytics/chargebot_inverter';
import { InverterVariable } from '@chargebot-services/core/timescale/chargebot_inverter';

export const main = async () => {
  try {
    const botScheduledAlerts = await BotScheduledAlert.findByScheduledAlert(ScheduledAlertName.DAILY_USE);

    if (botScheduledAlerts?.length == 0) {
      return createSuccessResponse({ "response": "success" });
    }

    const toAlert = botScheduledAlerts.filter(bsa => {
      const timeToSend = bsa.settings && 'time' in bsa.settings ? bsa.settings.time as string : '20:00';
      const timeZone = bsa.settings && 'timezone' in bsa.settings ? bsa.settings.timezone as string : 'UTC';
      const notificationTime = DateTime.fromISO(`${DateTime.now()
        .toFormat('yyyy-MM-dd')}T${timeToSend}`, { zone: timeZone })
        .toUTC();
      // time for the notification is in the last 15 min to now
      const utcNow = DateTime.utc();
      const fiftyMinAgo = utcNow.minus({minutes: 15});
      return notificationTime >= fiftyMinAgo && notificationTime <= utcNow;
    });

    if (toAlert?.length == 0) {
      return createSuccessResponse({ "response": "success" });
    }

    // find users to notify for each one of the bots
    const botIds = toAlert.map(bsa => bsa.bot_id);
    const usersByBot = await BotUser.getUsersToNotify(botIds);
    // find app installs for those users
    const userIds = usersByBot!.map(ub => ub.user_id);
    const appInstalls = await AppInstall.getAppsToNotify(userIds);

    toAlert.map(async (bsa) => {
      // get the users for this specific alert
      const users = usersByBot!.filter(bu => bu.bot_id === bsa.bot_id).map(bu => bu.user_id);
      // and the push tokens of those users
      const pushTokens = appInstalls!.filter(ai => users.includes(ai.user_id)).map(ai => ai.push_token!);

      if (pushTokens && pushTokens.length > 0 && bsa.bot?.bot_uuid) {
        // setup alert info
        const title = i18n.__(`push_alerts.daily_usage.title`);
        const usage = await ChargebotInverter.getTodayTotals(bsa.bot.bot_uuid, [InverterVariable.BATTERY_CHARGE_DIFF]);
        const data = {
          device_id: bsa.bot.bot_uuid,
          energy_kwh: Math.round(usage?.length > 0 ? usage[0].value : 0.0)
        };    
        // @ts-expect-error ignore type
        const message = i18n.__(`push_alerts.daily_usage.message`, data);

        // dispatch alert
        Log.info("SENT ALERT", { alertName: 'Daily Usage', pushTokens, title, message });
        await ExpoPush.send_push_notifications(pushTokens, message, title,
          {bot_uuid: bsa.bot.bot_uuid, bot_id: bsa.bot.id, energy_kwh: data.energy_kwh}
        )
      } else {
        Log.info("No users to be notified");
      }
    });

    return createSuccessResponse({ "response": "success" });
  } catch (error) {
    Log.error("ERROR", { error });
  }
};