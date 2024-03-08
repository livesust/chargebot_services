import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  console.log('IoT Event Log', event);
  return {};
};

export const main = middy(handler).use(warmup({ isWarmingUp }));