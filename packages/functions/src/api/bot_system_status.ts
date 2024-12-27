import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { ResponseSchema } from "../schemas/bot_system_status.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, getNumber, isWarmingUp } from "../shared/rest_utils";
import { BotUUIDPathParamSchema } from "src/shared/schemas";
import { ChargebotSystem } from "@chargebot-services/core/services/analytics/chargebot_system";
import { SystemVariables } from "@chargebot-services/core/timescale/chargebot_system";
import { ChargebotGps } from "@chargebot-services/core/services/analytics/chargebot_gps";
import { ChargebotAlert } from "@chargebot-services/core/services/analytics/chargebot_alert";
import { ChargebotError } from "@chargebot-services/core/services/analytics/chargebot_error";
import { DateTime } from "luxon";
import { ChargebotBattery, translateBatteryState } from "@chargebot-services/core/services/analytics/chargebot_battery";
import { BatteryVariables } from "@chargebot-services/core/timescale/chargebot_battery";
import { ChargebotInverter } from "@chargebot-services/core/services/analytics/chargebot_inverter";
import { ChargebotPDU } from "@chargebot-services/core/services/analytics/chargebot_pdu";
import { ChargebotTemperature } from "@chargebot-services/core/services/analytics/chargebot_temperature";
import { ChargebotFan } from "@chargebot-services/core/services/analytics/chargebot_fan";

// @ts-expect-error ignore any type for event
export const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;

  try {
    const [
      systemStatus,
      batteryStatus,
      location,
      activeAlerts,
      activeErrors,
      last24hActiveAlerts,
      last24hActiveErrors,
      inverterConnStatus,
      batteryConnStatus,
      pduConnStatus,
      gpsConnStatus,
      temperatureConnStatus,
      fanConnStatus,
    ] = await Promise.all([
      ChargebotSystem.getSystemStatus(bot_uuid),
      ChargebotBattery.getBatteryStatus(bot_uuid),
      ChargebotGps.getLastPositionByBot(bot_uuid),
      ChargebotAlert.countActiveWarningAlertsByBot(bot_uuid),
      ChargebotError.countActiveErrorsByBot(bot_uuid),
      ChargebotAlert.countTodayWarningAlertsByBot(bot_uuid),
      ChargebotError.countTodayActiveErrorsByBot(bot_uuid),
      ChargebotInverter.getConnectionStatus(bot_uuid),
      ChargebotBattery.getConnectionStatus(bot_uuid),
      ChargebotPDU.getConnectionStatus(bot_uuid),
      ChargebotGps.getConnectionStatus(bot_uuid),
      ChargebotTemperature.getConnectionStatus(bot_uuid),
      ChargebotFan.getConnectionStatus(bot_uuid),
    ]);
    
    const connected = systemStatus.find(s => s.variable === SystemVariables.CONNECTED);

    const response = {
      bot_uuid,
      online: getNumber(connected?.value) === 1,
      uptime: getNumber(systemStatus?.find(s => s.variable === SystemVariables.UPTIME_MINUTES)?.value),
      last_seen: connected?.bucket ? DateTime.fromJSDate(connected.bucket).setZone('UTC').toISO() : null,
      location_status: location?.vehicle_status,
      address: `${location?.address_number ?? '-'}, ${location?.street}, ${location?.city}`,
      active_alerts: getNumber(activeAlerts) + getNumber(activeErrors),
      active_alerts_24h: getNumber(last24hActiveAlerts) + getNumber(last24hActiveErrors),
      battery_level: getNumber(batteryStatus?.find(b => b.variable === BatteryVariables.LEVEL_SOC)?.value),
      battery_status: translateBatteryState(batteryStatus?.find(b => b.variable === BatteryVariables.STATE)?.value as number),
      inverter_connected: inverterConnStatus.connected,
      battery_connected: batteryConnStatus.connected,
      pdu_connected: pduConnStatus.connected,
      gps_connected: gpsConnStatus.connected,
      temperature_connected: temperatureConnStatus.connected,
      fan_connected: fanConnStatus.connected,
    };

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    // create and throw database errors
    const httpError = createError(406, "cannot query bot system status", { expose: true });
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
