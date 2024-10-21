import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";
import { BotUser } from "@chargebot-services/core/services/bot_user";
import { BotAlert } from "@chargebot-services/core/services/bot_alert";
import { BotChargingSettings } from "@chargebot-services/core/services/bot_charging_settings";
import { BotCompany } from "@chargebot-services/core/services/bot_company";
import { BotScheduledAlert } from "@chargebot-services/core/services/bot_scheduled_alert";
import { Outlet } from "@chargebot-services/core/services/outlet";
import { OutletEquipment } from "@chargebot-services/core/services/outlet_equipment";
import { OutletSchedule } from "@chargebot-services/core/services/outlet_schedule";
import { BotFirmwareInstall } from "@chargebot-services/core/services/bot_firmware_install";
import { BotComponentAttribute } from "@chargebot-services/core/services/bot_component_attribute";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_id = event?.detail?.id;
  const deleted_by = event?.detail?.deleted_by;
  if (bot_id) {
    const outlets = await Outlet.findByCriteria({bot_id});

    const promises = [
      BotAlert.removeByCriteria({bot_id}, deleted_by),
      BotChargingSettings.removeByCriteria({bot_id}, deleted_by),
      BotCompany.removeByCriteria({bot_id}, deleted_by),
      BotComponentAttribute.removeByCriteria({bot_id}, deleted_by),
      BotFirmwareInstall.removeByCriteria({bot_id}, deleted_by),
      BotScheduledAlert.removeByCriteria({bot_id}, deleted_by),
      BotUser.removeByCriteria({bot_id}, deleted_by),
      Outlet.removeByCriteria({bot_id}, deleted_by),
    ]
    if (outlets?.length > 0) {
      outlets.map(async (o) => {
        promises.push(OutletEquipment.removeByCriteria({outlet_id: o.id}, deleted_by));
        promises.push(OutletSchedule.removeByCriteria({outlet_id: o.id}, deleted_by))
      });
    }
    await Promise.all(promises)
  }
};

export const main = middy(handler).use(warmup({ isWarmingUp }));