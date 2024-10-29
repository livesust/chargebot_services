import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";
import { OutletEquipment } from "@chargebot-services/core/services/outlet_equipment";
import { updateEquipmentsShadow } from "./on_update_equipments_shadow";
import { Equipment } from "@chargebot-services/core/database/equipment";
import { Bot } from "@chargebot-services/core/services/bot";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const entity = event && (event.detailType ?? event['detail-type']);
  const user_id = event?.detail?.deleted_by;
  const equipment = event?.detail as Equipment;
  if(entity === 'outlet') {
    await OutletEquipment.unassignByOutlet(equipment.id!, user_id);
  } else if(entity === 'equipment') {
    const bot = await Bot.findBotByEquipment(equipment.id!);
    if (bot){
      updateEquipmentsShadow(bot.bot_uuid, equipment.customer_id);
    }
    await OutletEquipment.unassignByEquipment(equipment.id!, user_id);
  }
};

export const main = middy(handler).use(warmup({ isWarmingUp }));