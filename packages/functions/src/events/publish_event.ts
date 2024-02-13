import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";
import { IoTData } from "@chargebot-services/core/services/aws/iot_data";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const detail = event?.detail;
  if(detail?.topic && detail?.payload) {
    IoTData.publish(detail.topic, detail.payload)
  }
  return {};
};

export const main = middy(handler).use(warmup({ isWarmingUp }));