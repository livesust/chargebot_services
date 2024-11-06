import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { ArrayResponseSchema } from "../schemas/bot_connection_status.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotBattery, translateBatteryState } from "@chargebot-services/core/services/analytics/chargebot_battery";
import { getNumber } from "../shared/rest_utils";
import { BatteryVariables } from "@chargebot-services/core/timescale/chargebot_battery";
import { ChargebotSystem } from "@chargebot-services/core/services/analytics/chargebot_system";
import { SystemVariables } from "@chargebot-services/core/timescale/chargebot_system";
import { Bot } from "@chargebot-services/core/services/bot";

export const handler = async () => {
  const bots = await Bot.list();
  const botUuids = bots.map(b => b.bot_uuid);
  try {
    const [
        batteryStatus, systemStatus
    ] = await Promise.all([
      ChargebotBattery.getBatteryStatuses(botUuids),
      ChargebotSystem.getSystemStatuses(botUuids)
    ]);

    const response: {
      bot_uuid: string;
      battery_level: number;
      battery_status: string;
      connection_status: string;
    }[] = [];

    botUuids.forEach(botUuid => {  
      const iotConnected = systemStatus.find(b => b.device_id === botUuid && b.variable === SystemVariables.CONNECTED)?.value_boolean ?? false;
      const battery_level = getNumber(batteryStatus.find(b => b.device_id === botUuid && b.variable === BatteryVariables.LEVEL_SOC)?.value);
      const battery_status = batteryStatus.find(b => b.device_id === botUuid && b.variable === BatteryVariables.STATE)?.value;
      response.push({
        bot_uuid: botUuid,
        battery_level: battery_level,
        battery_status: translateBatteryState(battery_status as number),
        connection_status: iotConnected ? 'OK' : (battery_level <= 1 ? 'POWER_LOST' : 'SYSTEM_OFF'),
      });
    })

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    // create and throw database errors
    const httpError = createError(406, "cannot query bots connection status ", { expose: true });
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
  // after: inverse order execution
  .use(jsonBodySerializer(false))
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ArrayResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());
