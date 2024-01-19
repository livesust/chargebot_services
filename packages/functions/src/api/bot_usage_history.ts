import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema, ResponseSchema } from "../schemas/bot_usage_history.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { DateTime } from "luxon";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotInverter } from "@chargebot-services/core/services/analytics/chargebot_inverter";
import { getNumber } from "../shared/rest_utils";
import { InverterVariable } from "@chargebot-services/core/api/chargebot_inverter";
import { ChargebotBattery } from "@chargebot-services/core/services/analytics/chargebot_battery";

interface DailyUsage {
  bot_uuid: string,
  timestamp: Date,
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

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;
  const date = event.pathParameters!.date!;
  const from = DateTime.fromISO(date).setZone('UTC').toJSDate();
  const to = DateTime.fromISO(date).setZone('UTC').endOf('day').toJSDate();

  try {
    const [energyUsageTotals, inverterHourlyBuckets, batteryLevelSoc, batteryHourlyBuckets] = await Promise.all([
      ChargebotInverter.getTotalEnergyUsage(bot_uuid, from, to),
      ChargebotInverter.getEnergyUsageByHourBucket(bot_uuid, from, to),
      ChargebotBattery.getAvgBatteryLevel(bot_uuid, from, to),
      ChargebotBattery.getBatteryLevelByHourBucket(bot_uuid, from, to),
    ]);

    const energyUsageVariables: { [key: string]: unknown } = energyUsageTotals.reduce((acc: { [key: string]: unknown }, obj) => {
      acc[obj.variable] = obj.value;
      return acc;
    }, {});

    const hourly: HourlyUsage[] = [];

    inverterHourlyBuckets.forEach((obj) => {
      const hour_of_day = obj.bucket.getTime();

      let hour_record: HourlyUsage | undefined = hourly?.find((e) => e.hour_of_day === hour_of_day);
      if (!hour_record) {
        hour_record = Object.assign(new HourlyUsage(), { hour_of_day: hour_of_day });
        hourly.push(hour_record);
      }

      if (obj.variable === InverterVariable.ENERGY_USAGE) {
        hour_record.energy_usage = getNumber(obj.sum_value);
      }
      if (obj.variable === InverterVariable.GRID_CHARGE_DIFF) {
        hour_record.total_charging += getNumber(obj.avg_value);
        hour_record.grid_charging = getNumber(obj.avg_value);
      }
      if (obj.variable === InverterVariable.SOLAR_CHARGE_DIFF) {
        hour_record.total_charging += getNumber(obj.avg_value);
        hour_record.solar_charging = getNumber(obj.avg_value);
      }
    });

    batteryHourlyBuckets.forEach((obj) => {
      const hour_of_day = obj.bucket.getTime();

      const hour_record: HourlyUsage =
        hourly?.find((e) => e.hour_of_day === hour_of_day)
        ?? Object.assign(new HourlyUsage(), { hour_of_day: hour_of_day });
        hour_record.battery_level = getNumber(obj.avg_value);
    });

    const grid_charging = getNumber(energyUsageVariables[InverterVariable.GRID_CHARGE_DIFF]);
    const solar_charging = getNumber(energyUsageVariables[InverterVariable.SOLAR_CHARGE_DIFF]);

    const response: DailyUsage = {
      bot_uuid: bot_uuid,
      timestamp: from,
      energy_usage: getNumber(energyUsageVariables[InverterVariable.ENERGY_USAGE]),
      total_charging: grid_charging + solar_charging,
      grid_charging: grid_charging,
      solar_charging: solar_charging,
      battery_level: getNumber(batteryLevelSoc),
      hourly: hourly
    };

    return createSuccessResponse(response);
  } catch (error) {
    const httpError = createError(500, "cannot query bot usage by day", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(validator({ pathParametersSchema: PathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());