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
import { createSuccessResponse, getNumber, isWarmingUp } from "../shared/rest_utils";
import { ChargebotBattery } from "@chargebot-services/core/services/analytics/chargebot_battery";
import { ChargebotSystem } from "@chargebot-services/core/services/analytics/chargebot_system";
import { Bot } from "@chargebot-services/core/services/bot";
import { ChargebotAlert } from "@chargebot-services/core/services/analytics/chargebot_alert";
import { ChargebotError } from "@chargebot-services/core/services/analytics/chargebot_error";
import { ChargebotGps } from "@chargebot-services/core/services/analytics/chargebot_gps";
import { VehicleStatus } from "@chargebot-services/core/timescale/chargebot_gps";
import { ChargebotInverter } from "@chargebot-services/core/services/analytics/chargebot_inverter";
import { ChargebotPDU } from "@chargebot-services/core/services/analytics/chargebot_pdu";
import { ChargebotTemperature } from "@chargebot-services/core/services/analytics/chargebot_temperature";
import { ChargebotFan } from "@chargebot-services/core/services/analytics/chargebot_fan";
import { SystemVariables } from "@chargebot-services/core/timescale/chargebot_system";

export const handler = async () => {
  try {
    const bots = await Bot.lazyFindByCriteria({display_on_dashboard: true});
    const botUuids = bots.map(b => b.bot_uuid);

    const [
      lowBatteries,
      activeAlerts,
      activeErrors,
      last24hActiveAlerts,
      last24hActiveErrors,
      lastLocationsByBot,
      systemStatus,
      inverterConnStatues,
      batteryConnStatues,
      pduConnStatues,
      gpsConnStatues,
      temperatureConnStatues,
      fanConnStatues,
    ] = await Promise.all([
      ChargebotBattery.getLowBatteryBots(botUuids),
      ChargebotAlert.getActiveWarningAlertsByBots(botUuids),
      ChargebotError.getActiveErrorsByBots(botUuids),
      ChargebotAlert.getTodayWarningAlertsByBots(botUuids),
      ChargebotError.getTodayActiveErrorsByBots(botUuids),
      ChargebotGps.getLastPositionByBots(botUuids),
      ChargebotSystem.getSystemStatusByBots(botUuids),
      ChargebotInverter.getConnectionStatusByBots(botUuids),
      ChargebotBattery.getConnectionStatusByBots(botUuids),
      ChargebotPDU.getConnectionStatusByBots(botUuids),
      ChargebotGps.getConnectionStatusByBots(botUuids),
      ChargebotTemperature.getConnectionStatusByBots(botUuids),
      ChargebotFan.getConnectionStatusByBots(botUuids),
    ]);
    const botsWithSystemComponentsOffline = [...new Set([
      ...(inverterConnStatues?.filter(b => !b.connected).map(b => b.bot_uuid) ?? []),
      ...(batteryConnStatues?.filter(b => !b.connected).map(b => b.bot_uuid) ?? []),
      ...(pduConnStatues?.filter(b => !b.connected).map(b => b.bot_uuid) ?? []),
      ...(gpsConnStatues?.filter(b => !b.connected).map(b => b.bot_uuid) ?? []),
      ...(temperatureConnStatues?.filter(b => !b.connected).map(b => b.bot_uuid) ?? []),
      ...(fanConnStatues?.filter(b => !b.connected).map(b => b.bot_uuid) ?? []),
    ])]; //   => remove duplication

    const response = {
      total_bots: bots.length,
      offline_bots: getNumber(systemStatus.filter(s => s.variable === SystemVariables.CONNECTED && !s.value_boolean)?.length),
      low_battery_bots: getNumber(lowBatteries.length),
      active_alerts: getNumber(activeAlerts?.length) + getNumber(activeErrors?.length),
      active_alerts_24h: getNumber(last24hActiveAlerts?.length) + getNumber(last24hActiveErrors?.length),
      system_error_bots: getNumber(botsWithSystemComponentsOffline?.length),
      bots_at_home: getNumber(lastLocationsByBot.filter(l => l.vehicle_status === VehicleStatus.AT_HOME)?.length),
      bots_in_transit: getNumber(lastLocationsByBot.filter(l => l.vehicle_status === VehicleStatus.MOVING || l.vehicle_status === VehicleStatus.STOPPED)?.length),
      bots_on_location: getNumber(lastLocationsByBot.filter(l => l.vehicle_status === VehicleStatus.PARKED)?.length),
    };

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    // create and throw database errors
    const httpError = createError(406, "cannot query bot status summary", { expose: true });
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
