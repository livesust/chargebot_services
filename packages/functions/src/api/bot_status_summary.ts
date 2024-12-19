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
      offlineBots,
      offlineInverters,
      offlineBatteries,
      offlinePdus,
      offlineGps,
      offlineTemperature,
      offlineFan,
    ] = await Promise.all([
      ChargebotBattery.countLowBatteryBots(botUuids),
      ChargebotAlert.countActiveWarningAlertsByBots(botUuids),
      ChargebotError.countActiveErrorsByBots(botUuids),
      ChargebotAlert.countTodayWarningAlertsByBots(botUuids),
      ChargebotError.countTodayActiveErrorsByBots(botUuids),
      ChargebotGps.getLastPositionByBots(botUuids),
      ChargebotSystem.countConnectionStatus(botUuids, false),
      ChargebotInverter.countConnectionStatusByBots(botUuids, false),
      ChargebotBattery.countConnectionStatusByBots(botUuids, false),
      ChargebotPDU.countConnectionStatusByBots(botUuids, false),
      ChargebotGps.countConnectionStatusByBots(botUuids, false),
      ChargebotTemperature.countConnectionStatusByBots(botUuids, false),
      ChargebotFan.countConnectionStatusByBots(botUuids, false),
    ]);

    const response = {
      total_bots: bots.length,
      offline_bots: getNumber(offlineBots),
      low_battery_bots: getNumber(lowBatteries),
      active_alerts: getNumber(activeAlerts) + getNumber(activeErrors),
      active_alerts_24h: getNumber(last24hActiveAlerts) + getNumber(last24hActiveErrors),
      system_error_bots: getNumber(offlineInverters)
        + getNumber(offlineBatteries)
        + getNumber(offlinePdus)
        + getNumber(offlineGps)
        + getNumber(offlineTemperature)
        + getNumber(offlineFan),
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
