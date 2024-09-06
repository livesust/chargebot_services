import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";
import { BotUser } from "@chargebot-services/core/services/bot_user";
import { BotAlert } from "@chargebot-services/core/services/bot_alert";
import { BotChargingSettings } from "@chargebot-services/core/services/bot_charging_settings";
import { BotCompany } from "@chargebot-services/core/services/bot_company";
import { BotComponent } from "@chargebot-services/core/services/bot_component";
import { BotFirmware } from "@chargebot-services/core/services/bot_firmware";
import { BotScheduledAlert } from "@chargebot-services/core/services/bot_scheduled_alert";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_id = event?.detail?.id;
  const deleted_by = event?.detail?.deleted_by;
  if (bot_id) {
    await Promise.all([
      BotAlert.removeByCriteria({bot_id}, deleted_by),
      BotChargingSettings.removeByCriteria({bot_id}, deleted_by),
      BotCompany.removeByCriteria({bot_id}, deleted_by),
      BotComponent.removeByCriteria({bot_id}, deleted_by),
      BotFirmware.removeByCriteria({bot_id}, deleted_by),
      BotScheduledAlert.removeByCriteria({bot_id}, deleted_by),
      BotUser.removeByCriteria({bot_id}, deleted_by),
    ])
  }
};

export const main = middy(handler).use(warmup({ isWarmingUp }));