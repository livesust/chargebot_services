import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";
import { BotCompany } from "@chargebot-services/core/services/bot_company";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const company_id = event?.detail?.id;
  const deleted_by = event?.detail?.deleted_by;
  if (company_id) {
    await BotCompany.removeByCriteria({company_id}, deleted_by)
  }
};

export const main = middy(handler).use(warmup({ isWarmingUp }));