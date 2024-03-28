import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";
import { OutletEquipment } from "@chargebot-services/core/services/outlet_equipment";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const entity = event && (event.detailType ?? event['detail-type']);
  const entity_id = event?.detail?.id;
  const user_id = event?.detail?.deleted_by;
  console.log(`Delete OutletEquipment by ${entity} with ID ${entity_id}`);
  if(entity === 'outlet') {
    await OutletEquipment.unassignByOutlet(entity_id, user_id);
  } else if(entity === 'equipment') {
    await OutletEquipment.unassignByEquipment(entity_id, user_id);
  }
};

export const main = middy(handler).use(warmup({ isWarmingUp }));