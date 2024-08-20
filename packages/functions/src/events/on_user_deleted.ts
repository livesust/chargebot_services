import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";
import { Cognito } from "@chargebot-services/core/services/aws/cognito";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const cognito_id = event?.detail?.user_id;
  if (event?.source === 'deleted') {
    console.log(`Delete user from Cognito: ${cognito_id}`);
    await Cognito.deleteUser(cognito_id);
  }
};

export const main = middy(handler).use(warmup({ isWarmingUp }));