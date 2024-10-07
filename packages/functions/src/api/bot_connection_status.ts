import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { ResponseSchema } from "../schemas/bot_connection_status.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotBattery, translateBatteryState } from "@chargebot-services/core/services/analytics/chargebot_battery";
import { BotUUIDPathParamSchema } from "src/shared/schemas";
import { getNumber } from "../shared/rest_utils";
import { BatteryVariables } from "@chargebot-services/core/timescale/chargebot_battery";
import { ChargebotSystem } from "@chargebot-services/core/services/analytics/chargebot_system";
import { SystemVariables } from "@chargebot-services/core/timescale/chargebot_system";

// @ts-expect-error ignore any type for event
export const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;

  try {
    const [
        batteryStatus, systemStatus
    ] = await Promise.all([
      ChargebotBattery.getBatteryStatus(bot_uuid),
      ChargebotSystem.getSystemStatus(bot_uuid)
    ]);

    const batteryVariables: { [key: string]: unknown } = batteryStatus.reduce((acc: { [key: string]: unknown }, obj) => {
      acc[obj.variable] = obj.value;
      return acc;
    }, {});

    const systemVariables: { [key: string]: unknown } = systemStatus.reduce((acc: { [key: string]: unknown }, obj) => {
      acc[obj.variable] = obj.value ?? obj.value_boolean;
      return acc;
    }, {});

    const iotConnected = systemVariables[SystemVariables.CONNECTED] ?? false;

    const battery_level = getNumber(batteryVariables[BatteryVariables.LEVEL_SOC]);

    const response = {
      bot_uuid,
      battery_level: battery_level,
      battery_status: translateBatteryState(batteryVariables[BatteryVariables.STATE] as number),
      connection_status: iotConnected ? 'OK' : (battery_level <= 1 ? 'POWER_LOST' : 'SYSTEM_OFF'),
    };

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    // create and throw database errors
    const httpError = createError(406, "cannot query bot status", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  // .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(validator({ pathParametersSchema: BotUUIDPathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer(false))
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());
