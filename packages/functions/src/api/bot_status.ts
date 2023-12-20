import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { ResponseSchema } from "../schemas/bot_status.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotBattery } from "@chargebot-services/core/services/analytics/chargebot_battery";
import { ChargebotInverter } from "@chargebot-services/core/services/analytics/chargebot_inverter";
import { ChargebotPDU } from "@chargebot-services/core/services/analytics/chargebot_pdu";
import { ChargebotError } from "@chargebot-services/core/services/analytics/chargebot_error";
import { IotShadow } from "@chargebot-services/core/services/iot/iot_shadow";
import { InverterVariable } from "@chargebot-services/core/api/chargebot_inverter";
import { BotUUIDPathParamSchema } from "src/shared/schemas";


const getNumber = (value: unknown):number => {
  if (!value || isNaN(value as number)) {
    return 0;
  }
  return value as number;
}

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;

  try {
    const [battery_level, battery_status, inverterStatus, inverterTotals, output_current, conn_status, system_status, iot_status] = await Promise.all([
      ChargebotBattery.getBatteryLevel(bot_uuid),
      ChargebotInverter.getBatteryStatus(bot_uuid),
      ChargebotInverter.getInverterStatus(bot_uuid),
      ChargebotInverter.getEnergyTotalsToday(bot_uuid),
      ChargebotPDU.getPDUCurrent(bot_uuid),
      ChargebotError.getConnectionStatus(bot_uuid),
      ChargebotError.getSystemStatus(bot_uuid),
      IotShadow.getSystemStatus(bot_uuid),
    ]);

    const inverterVariables: { [key: string]: unknown } = inverterStatus.reduce((acc: { [key: string]: unknown }, obj) => {
      acc[obj.variable] = obj.value;
      return acc;
    }, {});

    const inverterTotalVariables: { [key: string]: unknown } = inverterTotals.reduce((acc: { [key: string]: unknown }, obj) => {
      acc[obj.variable] = obj.value;
      return acc;
    }, {});

    const iotConnected = iot_status?.state?.reported?.connected === 'true' ?? false;

    const grid_charging = getNumber(inverterTotalVariables[InverterVariable.GRID_CHARGE_DIFF]);
    const solar_charging = getNumber(inverterTotalVariables[InverterVariable.SOLAR_CHARGE_DIFF]);
    const battery_charging = getNumber(inverterTotalVariables[InverterVariable.BATTERY_CHARGE_DIFF]);
    const battery_discharging = getNumber(inverterTotalVariables[InverterVariable.BATTERY_DISCHARGE_DIFF]);

    const response = {
      bot_uuid,
      battery_level: getNumber(battery_level),
      battery_status: battery_status ?? 'UNKNOWN',
      output_current: getNumber(output_current),
      grid_current: getNumber(inverterVariables[InverterVariable.GRID_CURRENT]),
      solar_power: getNumber(inverterVariables[InverterVariable.SOLAR_POWER]),
      today_energy_usage: getNumber(inverterTotalVariables[InverterVariable.ENERGY_USAGE]),
      today_total_charging: grid_charging + solar_charging,
      today_grid_charging: grid_charging ,
      today_solar_charging: solar_charging,
      today_battery_charging: battery_charging,
      today_battery_discharging: battery_discharging,
      connection_status: (conn_status === 'OK' && iotConnected) ? 'OK' : 'ERROR',
      system_status: system_status
    };

    return createSuccessResponse(response);
  } catch (error) {
    // create and throw database errors
    const httpError = createError(500, "cannot query bot status", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(validator({ pathParametersSchema: BotUUIDPathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());
