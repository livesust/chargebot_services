import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema, PaginateResponseSchema } from "../schemas/bot_status_list.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { dateReviver } from "../shared/middlewares/json-date-parser";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import jsonBodyParser from "@middy/http-json-body-parser";
import { Bot, BotCriteria } from "@chargebot-services/core/services/bot";
import { ChargebotSystem } from "@chargebot-services/core/services/analytics/chargebot_system";
import { ChargebotBattery } from "@chargebot-services/core/services/analytics/chargebot_battery";
import { ChargebotAlert } from "@chargebot-services/core/services/analytics/chargebot_alert";
import { ChargebotGps } from "@chargebot-services/core/services/analytics/chargebot_gps";
import { VehicleStatus } from "@chargebot-services/core/timescale/chargebot_gps";
import { ChargebotError } from "@chargebot-services/core/services/analytics/chargebot_error";
import { ChargebotInverter } from "@chargebot-services/core/services/analytics/chargebot_inverter";
import { ChargebotPDU } from "@chargebot-services/core/services/analytics/chargebot_pdu";
import { ChargebotTemperature } from "@chargebot-services/core/services/analytics/chargebot_temperature";
import { ChargebotFan } from "@chargebot-services/core/services/analytics/chargebot_fan";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const page = event.pathParameters?.page ?? 0;
  const pageSize = event.pathParameters?.pageSize ?? 10;
  const sort = event.pathParameters?.sort ?? 'asc';
  const filters = event.body ?? {};

  try {
    const allBots = await Bot.lazyFindByCriteria(filters);
    let botUuids: string[] = allBots.map(b => b.bot_uuid);
    if (filters.is_offline) {
      // filter to return only offline bots and/or with system error
      const systemFailureBots = await ChargebotSystem.getBotsWithSystemFailure(botUuids);
      botUuids = filters.is_offline ? systemFailureBots.filter(b => b.is_online === 0).map(b => b.device_id) : botUuids;
    }

    if (filters.has_system_error) {
      // filter to return only offline bots and/or with system error
      const [
        inverterConnStatues,
        batteryConnStatues,
        pduConnStatues,
        gpsConnStatues,
        temperatureConnStatues,
        fanConnStatues,
      ] = await Promise.all([
        ChargebotInverter.getConnectionStatusByBots(botUuids),
        ChargebotBattery.getConnectionStatusByBots(botUuids),
        ChargebotPDU.getConnectionStatusByBots(botUuids),
        ChargebotGps.getConnectionStatusByBots(botUuids),
        ChargebotTemperature.getConnectionStatusByBots(botUuids),
        ChargebotFan.getConnectionStatusByBots(botUuids),
      ]);
      botUuids = [...new Set([
        ...(inverterConnStatues?.filter(b => !b.connected).map(b => b.bot_uuid) ?? []),
        ...(batteryConnStatues?.filter(b => !b.connected).map(b => b.bot_uuid) ?? []),
        ...(pduConnStatues?.filter(b => !b.connected).map(b => b.bot_uuid) ?? []),
        ...(gpsConnStatues?.filter(b => !b.connected).map(b => b.bot_uuid) ?? []),
        ...(temperatureConnStatues?.filter(b => !b.connected).map(b => b.bot_uuid) ?? []),
        ...(fanConnStatues?.filter(b => !b.connected).map(b => b.bot_uuid) ?? []),
      ])]; //   => remove duplication
    }

    if (filters.has_low_battery) {
      // filter to return only low battery bots
      const lowBatteryBots = await ChargebotBattery.getLowBatteryBots(botUuids);
      botUuids = lowBatteryBots.map(b => b.device_id);
    }

    if (filters.has_alerts) {
      // filter to return only bots with active alerts/errors
      const alertedBots = await ChargebotAlert.getActiveWarningAlertsByBots(botUuids) ?? [];
      alertedBots.push(...(await ChargebotError.getActiveErrorsByBots(botUuids) ?? []));
      botUuids = alertedBots.map(b => b.device_id);
    }

    if (filters.hast_24h_alerts) {
      // filter to return only bots with active alerts/errors in last 24h
      const todayAlertsBots = await ChargebotAlert.getTodayWarningAlertsByBots(botUuids) ?? [];
      todayAlertsBots.push(...(await ChargebotError.getTodayActiveErrorsByBots(botUuids) ?? []));
      botUuids = todayAlertsBots.map(b => b.device_id);
    }

    if (filters.is_at_home || filters.is_in_transit || filters.is_on_location) {
      // filter to return only bots by position
      const lastPositions = await ChargebotGps.getLastPositionByBots(botUuids);
      botUuids = filters.is_at_home ? lastPositions.filter(b => b.vehicle_status === VehicleStatus.AT_HOME).map(b => b.device_id) : botUuids;
      botUuids = filters.is_in_transit ? lastPositions.filter(b => b.vehicle_status === VehicleStatus.MOVING || b.vehicle_status === VehicleStatus.STOPPED).map(b => b.device_id) : botUuids;
      botUuids = filters.is_on_location ? lastPositions.filter(b => b.vehicle_status === VehicleStatus.PARKED).map(b => b.device_id) : botUuids;
    }

    const criteria: BotCriteria = {
      display_on_dashboard: true,
      name: filters.name,
      bot_uuid: filters.bot_uuid,
      customer_name: filters.customer_name,
      company_name: filters.company_name,
      bot_uuid_array: botUuids
    };

    const [
      bots,
      botsCount
    ] = await Promise.all([
      Bot.paginate(+page, +pageSize, sort, criteria),
      Bot.count(criteria),
    ]);

    return createSuccessResponse({
      records: bots,
      count: botsCount
    });
  } catch (error) {
    Log.error("Cannot summary list bots", { error });
    const httpError = createError(406, "cannot summary list bots", { expose: true });
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
  .use(validator({
    pathParametersSchema: PathParamSchema,
    // eventSchema: FiltersSchema
  }))
  .use(jsonBodyParser({ reviver: dateReviver }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: PaginateResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());