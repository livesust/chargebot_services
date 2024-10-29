import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { Bot } from "@chargebot-services/core/services/bot";
import { IoTData } from "@chargebot-services/core/services/aws/iot_data";
import { Equipment } from "@chargebot-services/core/database/equipment";
import { Equipment as EquipmentService } from "@chargebot-services/core/services/equipment";


export const updateEquipmentsShadow = async (bot_uuid: string, customerId: number) => {
  const equipments = await EquipmentService.findByCriteria({customer_id: customerId});

  const equipmentsConfig = {
    bot_uuid: bot_uuid,
    equipments: equipments.filter(e => !!e.rfid)
      .map(e => ({
        id: e.id,
        name: e.name,
        rfid: e.rfid
      })
    )
  };

  Log.debug('Equipments Shadow set', {equipmentsConfig});
  IoTData.updateShadowStatus(bot_uuid, 'equipments', equipmentsConfig);
}

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const equipment = event?.detail as Equipment;
  if(equipment?.id) {
    const bot = await Bot.findBotByEquipment(equipment.id);
  
    if (!bot) {
      Log.info("Bot not found");
      return createNotFoundResponse({ "response": "bot not found" });
    }

    updateEquipmentsShadow(bot.bot_uuid, equipment.customer_id);
  }
  return createSuccessResponse({ "response": "success" });
};

export const main = middy(handler).use(warmup({ isWarmingUp }));