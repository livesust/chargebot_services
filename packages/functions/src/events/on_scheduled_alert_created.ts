import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";
import { Bot } from "@chargebot-services/core/services/bot";
import { BotScheduledAlert } from "@chargebot-services/core/services/bot_scheduled_alert";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const scheduled_alert = event?.detail;
  if(scheduled_alert?.id) {
    /*
    When a scheduled_alert is created, we must:
      - assign the new scheduled alert to all existent users
    */

    const bots = await Bot.list();
    const promises = bots.map(async (bot) => {
      const attrs = Object.keys(scheduled_alert.config_settings);
      return BotScheduledAlert.create({
        bot_id: bot.id!,
        scheduled_alert_id: scheduled_alert.id!,
        alert_status: true,
        settings: scheduled_alert.config_settings ? attrs.reduce((acc, key) => {
          // @ts-expect-error ignore error
          acc[key] = alert.config_settings![key].default;
          return acc;
        }, {}) : undefined,
        created_by: scheduled_alert.created_by,
        created_date: new Date(),
        modified_by: scheduled_alert.modified_by,
        modified_date: new Date(),
      });
    })

    await Promise.all(promises);

  }
};

export const main = middy(handler).use(warmup({ isWarmingUp }));