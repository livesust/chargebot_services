import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";
import { Info } from "luxon";
import { BotChargingSettings } from "@chargebot-services/core/services/bot_charging_settings";
import { OutletType } from "@chargebot-services/core/services/outlet_type";
import { Outlet } from "@chargebot-services/core/services/outlet";
import { OutletSchedule } from "@chargebot-services/core/services/outlet_schedule";
import { ScheduledAlert as ScheduledAlertService } from "@chargebot-services/core/services/scheduled_alert";
import { BotScheduledAlert } from "@chargebot-services/core/services/bot_scheduled_alert";
import { sql } from "kysely";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot = event?.detail;
  if(bot?.id) {
    /*
    When a bot is created, we must:
      - create the 8 outlets and all day scheduled
      - create bot charging setings of all day for every day of week
    */

    // create 8 outlets with all day scheduled
    // eslint-disable-next-line prefer-const
    let [outletType, scheduledAlerts] = await Promise.all([OutletType.findOneByCriteria({type: 'PDU Outlet'}), ScheduledAlertService
      .list()]);
    
    const audit = {
      created_by: bot.created_by,
      created_date: new Date(),
      modified_by: bot.created_by,
      modified_date: new Date(),
    };

    if (!outletType) {
      outletType = (await OutletType.create({
        type: 'PDU Outlet',
        "outlet_amps": 16,
        "outlet_volts": 120,
        ...audit
      }))?.entity;
    }

    for (let i = 1; i <= 8; i++) {
      const outlet = await Outlet.create({
        bot_id: bot.id,
        outlet_type_id: outletType!.id!,
        pdu_outlet_number: i,
        ...audit
      });
      await OutletSchedule.create({
        all_day: true,
        outlet_id: outlet!.entity!.id!,
        ...audit
      });
    }
      
    // create bot charging setings of all day for every day of week
    const weekdays = Info.weekdays();
    for (const day in weekdays) {
      await BotChargingSettings.create({
        bot_id: bot.id,
        all_day: true,
        day_of_week: day,
        ...audit
      })
    }

    // create scheduled alerts
    for (const alert of scheduledAlerts) {
      await BotScheduledAlert.create({
        bot_id: bot.id,
        scheduled_alert_id: alert.id!,
        alert_status: true,
        settings: alert.config_settings ? Object.keys(alert.config_settings).reduce((acc, key) => {
          // @ts-expect-error ignore error
          acc[key] = alert.config_settings![key].default;
          return acc;
        }, {}) : undefined,
        ...audit
      });
    }

  }
};

export const main = middy(handler).use(warmup({ isWarmingUp }));