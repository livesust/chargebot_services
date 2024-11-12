import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { ResponseSchema } from "../schemas/bot_status.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { translateBatteryState } from "@chargebot-services/core/services/analytics/chargebot_battery";
import { translatePDUState } from "@chargebot-services/core/services/analytics/chargebot_pdu";
import { InverterVariable } from "@chargebot-services/core/timescale/chargebot_inverter";
import { BotUUIDPathParamSchema } from "src/shared/schemas";
import { getNumber } from "../shared/rest_utils";
import { DateTime } from "luxon";
import { PDUVariable } from "@chargebot-services/core/timescale/chargebot_pdu";
import { BatteryVariables } from "@chargebot-services/core/timescale/chargebot_battery";
import { SystemVariables } from "@chargebot-services/core/timescale/chargebot_system";
import { TemperatureVariables } from "@chargebot-services/core/timescale/chargebot_temperature";
import { FanVariables } from "@chargebot-services/core/timescale/chargebot_fan";
import { ChargebotBotStatus } from "@chargebot-services/core/services/analytics/chargebot_bot_status";
import { BotComponents } from "@chargebot-services/core/timescale/chargebot_bot_status";
import { ChargebotAnalysis } from "@chargebot-services/core/services/analytics/chargebot_analysis";

// @ts-expect-error ignore any type for event
export const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;

  try {
    const [botStatus, todayTotals] = await Promise.all([
      ChargebotBotStatus.getBotStatus(bot_uuid),
      ChargebotAnalysis.getTodayTotals(bot_uuid)
    ]);

    const botVariables: { [key: string]: unknown } = botStatus.reduce((acc: { [key: string]: unknown }, obj) => {
      acc[`${obj.component}_${obj.variable}`] = obj.value;
      return acc;
    }, {});

    const todayTotalVariables: { [key: string]: unknown } = todayTotals.reduce((acc: { [key: string]: unknown }, obj) => {
      acc[obj.variable] = obj.value;
      return acc;
    }, {});

    // convert values from kWh to Wh
    const batteryCharging = getNumber(todayTotalVariables[InverterVariable.BATTERY_CHARGE_DIFF]) * 1000;
    const batteryDischarging = getNumber(todayTotalVariables[InverterVariable.BATTERY_DISCHARGE_DIFF]) * 1000;
    const solarCharging = getNumber(todayTotalVariables[InverterVariable.SOLAR_CHARGE_DIFF]) * 1000;
    const gridCharging = getNumber(todayTotalVariables[InverterVariable.GRID_CHARGE_DIFF]) * 1000;
    const energyUsage = getNumber(todayTotalVariables[InverterVariable.ENERGY_USAGE]) * 1000;

    const connected = botStatus.find(s => s.variable === SystemVariables.CONNECTED && s.component === BotComponents.SYSTEM);
    const iotConnectedTime = connected?.timestamp;
    const iotConnected = connected?.value === 1;

    const inverterMaxTime = botStatus.reduce((max, item) => 
      item.timestamp > max ? item.timestamp : max,
      botStatus[0].timestamp
    );
    const lastSeen = inverterMaxTime
      ? DateTime.fromJSDate(inverterMaxTime).setZone('UTC').toISO()
      : (iotConnectedTime ? DateTime.fromJSDate(iotConnectedTime).setZone('UTC').toISO() : null);

    const battery_level = getNumber(botVariables[`${BotComponents.BATTERY}_${BatteryVariables.LEVEL_SOC}`]);

    const response = {
      bot_uuid,
      temperature: getNumber(botVariables[`${BotComponents.TEMPERATURE}_${TemperatureVariables.TEMPERATURE}`]),
      fan_status: Reflect.has(botVariables, `${BotComponents.FAN}_${FanVariables.STATUS}`) === true && botVariables[`${BotComponents.FAN}_${FanVariables.STATUS}`] === 1,
      battery_level: battery_level,
      battery_status: translateBatteryState(botVariables[`${BotComponents.BATTERY}_${BatteryVariables.STATE}`] as number),
      output_current: getNumber(botVariables[`${BotComponents.PDU}_${PDUVariable.CURRENT}`]),
      grid_power: getNumber(botVariables[`${BotComponents.INVERTER}_${InverterVariable.GRID_CURRENT}`]) * getNumber(botVariables[`${BotComponents.INVERTER}_${InverterVariable.GRID_VOLTAGE}`], 120),
      solar_power: getNumber(botVariables[`${BotComponents.INVERTER}_${InverterVariable.SOLAR_POWER}`]),
      today_energy_usage: getNumber(energyUsage),
      today_total_charging: getNumber(gridCharging) + getNumber(solarCharging),
      today_grid_charging: getNumber(gridCharging) ,
      today_solar_charging: getNumber(solarCharging),
      today_battery_charging: getNumber(batteryCharging),
      today_battery_discharging: getNumber(batteryDischarging),
      pdu_status: translatePDUState(botVariables[`${BotComponents.PDU}_${PDUVariable.STATE}`] as number),
      connection_status: iotConnected ? 'OK' : (battery_level <= 1 ? 'POWER_LOST' : 'SYSTEM_OFF'),
      system_status: Reflect.has(botVariables, 'errors_count') === false || botVariables['errors_count'] == 0 ? 'OK' : 'ERROR',
      last_seen: lastSeen
    };

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    // create and throw database errors
    const httpError = createError(406, `cannot query bot status: ${error}`, { expose: true });
    httpError.details = error;
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
