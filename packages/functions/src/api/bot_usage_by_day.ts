import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema, ResponseSchema } from "../schemas/bot_usage_history.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { DateTime } from "luxon";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotInverter } from "@chargebot-services/core/services/analytics/chargebot_inverter";
import { getNumber } from "../shared/rest_utils";
import { InverterVariable } from "@chargebot-services/core/timescale/chargebot_inverter";
import { ChargebotBattery } from "@chargebot-services/core/services/analytics/chargebot_battery";

export interface DailyUsage {
  timestamp: string,
  energy_usage: number,
  total_charging: number,
  grid_charging: number,
  solar_charging: number,
  battery_level: number,
  hourly: HourlyUsage[]
}

export class HourlyUsage {
  hour_of_day = 0;
  energy_usage = 0;
  total_charging = 0;
  grid_charging = 0;
  solar_charging = 0;
  battery_level = 0;
}

function getHourlyRecord(records: HourlyUsage[], hour_of_day: number): HourlyUsage {
  let hour_record = records?.find((e) => e.hour_of_day === hour_of_day);
  if (!hour_record) {
    hour_record = Object.assign(new HourlyUsage(), { hour_of_day: hour_of_day });
    records.push(hour_record);
  }
  return hour_record;
}

export async function getUsageByDay(bot_uuid: string, from: Date, to: Date) {
  const now = DateTime.now().setZone('UTC');
  from = DateTime.fromJSDate(from).setZone('UTC').startOf('day').toJSDate();
  if (now >= DateTime.fromJSDate(to)) {
    to = DateTime.fromJSDate(to).setZone('UTC').endOf('day').toJSDate();
  } else {
    to = now.toJSDate();
  }
  


  const [energyUsageTotals, inverterHourlyBuckets, batteryLevelSoc, batteryHourlyBuckets] = await Promise.all([
    ChargebotInverter.getTotalEnergyUsage(bot_uuid, from, to),
    ChargebotInverter.getEnergyUsageByHourBucket(bot_uuid, from, to),
    ChargebotBattery.getLastBatteryLevel(bot_uuid, from, to),
    ChargebotBattery.getBatteryLevelByHourBucket(bot_uuid, from, to),
  ]);

  const energyUsageVariables: { [key: string]: unknown; } = energyUsageTotals.reduce((acc: { [key: string]: unknown; }, obj) => {
    acc[obj.variable] = obj.value;
    return acc;
  }, {});

  const hourly: HourlyUsage[] = [];

  inverterHourlyBuckets.forEach((obj) => {
    const hour_of_day = obj.hour.getTime();

    const hour_record: HourlyUsage = getHourlyRecord(hourly, hour_of_day);

    if (obj.variable === InverterVariable.ENERGY_USAGE) {
      hour_record.energy_usage = getNumber(obj.value);
    }
    if (obj.variable === InverterVariable.GRID_CHARGE_DIFF) {
      hour_record.total_charging += getNumber(obj.value);
      hour_record.grid_charging = getNumber(obj.value);
    }
    if (obj.variable === InverterVariable.SOLAR_CHARGE_DIFF) {
      hour_record.total_charging += getNumber(obj.value);
      hour_record.solar_charging = getNumber(obj.value);
    }
  });

  batteryHourlyBuckets.forEach((obj) => {
    const hour_of_day = obj.hour.getTime();
    const hour_record: HourlyUsage = getHourlyRecord(hourly, hour_of_day);
    hour_record.battery_level = getNumber(obj.value);
  });

  const grid_charging = getNumber(energyUsageVariables[InverterVariable.GRID_CHARGE_DIFF]);
  const solar_charging = getNumber(energyUsageVariables[InverterVariable.SOLAR_CHARGE_DIFF]);
  const energy_usage = getNumber(energyUsageVariables[InverterVariable.ENERGY_USAGE]);

  const response: DailyUsage = {
    timestamp: DateTime.fromJSDate(from).setZone('UTC').toISO()!,
    energy_usage: energy_usage,
    total_charging: grid_charging + solar_charging,
    grid_charging: grid_charging,
    solar_charging: solar_charging,
    battery_level: getNumber(batteryLevelSoc),
    hourly: hourly
  };
  return response;
}

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;
  const date = event.pathParameters!.date!;
  const from = DateTime.fromISO(date).setZone('UTC').toJSDate();
  const to = DateTime.fromISO(date).setZone('UTC').endOf('day').toJSDate();

  try {
    const response: DailyUsage = await getUsageByDay(bot_uuid, from, to);

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    const httpError = createError(406, "cannot query bot usage by day", { expose: true });
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
  .use(validator({ pathParametersSchema: PathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer(false))
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());
