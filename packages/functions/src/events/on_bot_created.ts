import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";
import { Info } from "luxon";
import { BotChargingSettings } from "@chargebot-services/core/services/bot_charging_settings";
import { OutletType } from "@chargebot-services/core/services/outlet_type";
import { Outlet } from "@chargebot-services/core/services/outlet";
import { OutletSchedule } from "@chargebot-services/core/services/outlet_schedule";

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
    let outletType = await OutletType.findOneByCriteria({type: 'PDU Outlet'});
    if (!outletType) {
      outletType = (await OutletType.create({
        type: 'PDU Outlet',
        "outlet_amps": 16,
        "outlet_volts": 120,
        created_by: bot.created_by,
        created_date: new Date()
      }))?.entity;
    }

    for (let i = 1; i <= 8; i++) {
      const outlet = await Outlet.create({
        bot_id: bot.id,
        outlet_type_id: outletType!.id!,
        pdu_outlet_number: i,
        created_by: bot.created_by,
        created_date: new Date()
      });
      await OutletSchedule.create({
        all_day: true,
        outlet_id: outlet!.entity!.id!,
        created_by: bot.created_by,
        created_date: new Date()
      });
    }
      
    // create bot charging setings of all day for every day of week
    const weekdays = Info.weekdays();
    for (const day in weekdays) {
      await BotChargingSettings.create({
        bot_id: bot.id,
        all_day: true,
        day_of_week: day,
        created_by: bot.created_by,
        created_date: new Date()
      })
    }

  }
};

export const main = middy(handler).use(warmup({ isWarmingUp }));