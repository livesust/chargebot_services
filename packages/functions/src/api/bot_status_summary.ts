import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { ResponseSchema } from "../schemas/bot_status_summary.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotBattery } from "@chargebot-services/core/services/analytics/chargebot_battery";
import { ChargebotSystem } from "@chargebot-services/core/services/analytics/chargebot_system";
import { getNumber } from "../shared/rest_utils";
import { BatteryFirmwareState, BatteryVariables } from "@chargebot-services/core/timescale/chargebot_battery";
import { Bot } from "@chargebot-services/core/services/bot";
import { SystemVariables } from "@chargebot-services/core/timescale/chargebot_system";

export const handler = async () => {
  try {
    const bots = await Bot.list();
    const botUuids = bots.map(b => b.bot_uuid);
    
    const [batteries, systems] = await Promise.all([
      ChargebotBattery.getBatteryStatuses(botUuids),
      ChargebotSystem.getSystemStatuses(botUuids)
    ]);

    const totals = botUuids.reduce((acc, botUuid) => {
      const systemVariables: { [key: string]: unknown } = systems.filter(s => s.device_id === botUuid)
      .reduce((acc: { [key: string]: unknown }, obj) => {
        acc[obj.variable] = obj.value ?? obj.value_boolean;
        return acc;
      }, {});

      const batteryVariables: { [key: string]: unknown } = batteries.filter(b => b.device_id === botUuid)
        .reduce((acc: { [key: string]: unknown }, obj) => {
          acc[obj.variable] = obj.value;
          return acc;
        }, {});

      const connected = systemVariables[SystemVariables.CONNECTED] ?? false;
      const cpu = getNumber(systemVariables[SystemVariables.CPU]);
      const memory = getNumber(systemVariables[SystemVariables.MEMORY]);
      const temperature = getNumber(systemVariables[SystemVariables.TEMPERATURE]);
      const batteryLevel = getNumber(batteryVariables[BatteryVariables.LEVEL_SOC]);
      const batteryState = getNumber(batteryVariables[BatteryVariables.STATE]);
  
      acc.total_bots += 1;
      acc.offline_bots += !connected ? 1 : 0;
      acc.low_battery_bots = batteryLevel < 12 && batteryState === BatteryFirmwareState.DISCHARGING ? 1 : 0;
      acc.acc_cpu += cpu;
      acc.acc_memory += memory;
      acc.acc_temp += temperature;
      acc.max_cpu = cpu > acc.max_cpu ? cpu : acc.max_cpu;
      acc.max_memory = memory > acc.max_memory ? memory : acc.max_memory;
      acc.max_temp = temperature > acc.max_temp ? temperature : acc.max_temp;
      acc.min_temp = temperature < acc.min_temp ? temperature : acc.min_temp;
      return acc;
    }, { total_bots: 0, offline_bots: 0, low_battery_bots: 0, max_cpu: 0, acc_cpu: 0, max_memory: 0, acc_memory: 0, min_temp: 9999, max_temp: 0, acc_temp: 0 });

    const response = {
      total_bots: totals.total_bots,
      offline_bots: totals.offline_bots,
      low_battery_bots: totals.low_battery_bots,
      avg_cpu: totals.acc_cpu/totals.total_bots,
      max_cpu: totals.max_cpu,
      avg_memory: totals.acc_memory/totals.total_bots,
      max_memory: totals.max_memory,
      avg_temperature: totals.acc_temp/totals.total_bots,
      min_temperature: totals.min_temp,
      max_temperature: totals.max_temp,
    };

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    // create and throw database errors
    const httpError = createError(406, "cannot query all bot status summary", { expose: true });
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
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());
