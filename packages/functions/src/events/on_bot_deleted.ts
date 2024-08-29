import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_id = event?.detail?.id;
  const deleted_by = event?.detail?.deleted_by;
  
};

export const main = middy(handler).use(warmup({ isWarmingUp }));