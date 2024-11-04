import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { ResponseSchema } from "../schemas/bot_hardware_status.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, getNumber, isWarmingUp } from "../shared/rest_utils";
import { ChargebotTemperature } from "@chargebot-services/core/services/analytics/chargebot_temperature";
import { BotUUIDPathParamSchema } from "src/shared/schemas";
import { DateTime } from "luxon";
import { ChargebotSystem } from "@chargebot-services/core/services/analytics/chargebot_system";
import { SystemVariables } from "@chargebot-services/core/timescale/chargebot_system";
import { ChargebotInverter } from "@chargebot-services/core/services/analytics/chargebot_inverter";
import { ChargebotBattery } from "@chargebot-services/core/services/analytics/chargebot_battery";
import { ChargebotPDU } from "@chargebot-services/core/services/analytics/chargebot_pdu";
import { ChargebotGps } from "@chargebot-services/core/services/analytics/chargebot_gps";
import { ChargebotFan } from "@chargebot-services/core/services/analytics/chargebot_fan";

// @ts-expect-error ignore any type for event
export const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;

  try {
    const [
        systemStatus, inverterStatus, batteryStatus, pduStatus, gpsStatus, temperatureStatus, fanStatus
    ] = await Promise.all([
      ChargebotSystem.getSystemStatus(bot_uuid),
      ChargebotInverter.getConnectionStatus(bot_uuid),
      ChargebotBattery.getConnectionStatus(bot_uuid),
      ChargebotPDU.getConnectionStatus(bot_uuid),
      ChargebotGps.getConnectionStatus(bot_uuid),
      ChargebotTemperature.getConnectionStatus(bot_uuid),
      ChargebotFan.getConnectionStatus(bot_uuid),
    ]);

    const systemVariables: { [key: string]: unknown } = systemStatus.reduce((acc: { [key: string]: unknown }, obj) => {
      acc[obj.variable] = obj.value ?? obj.value_boolean;
      return acc;
    }, {});

    // convert values from kWh to Wh
    const iotConnectedTime = systemStatus.filter(s => s.variable === SystemVariables.CONNECTED)[0]?.timestamp;
    
    const response = {
      bot_uuid,
      iot: {
        connected: systemVariables[SystemVariables.CONNECTED] ?? false,
        last_seen: iotConnectedTime ? DateTime.fromJSDate(iotConnectedTime).setZone('UTC').toISO() : null
      },
      pi: {
        cpu: getNumber(systemVariables[SystemVariables.CPU]),
        memory: getNumber(systemVariables[SystemVariables.MEMORY]),
        disk: getNumber(systemVariables[SystemVariables.DISK]),
        temperature: getNumber(systemVariables[SystemVariables.TEMPERATURE]),
        uptime: getNumber(systemVariables[SystemVariables.UPTIME_MINUTES]),
        undervoltage: getNumber(systemVariables[SystemVariables.UNVERVOLTAGE]),
      },
      inverter: {
        connected: inverterStatus.connected,
        last_seen: inverterStatus.timestamp,
      },
      battery: {
        connected: batteryStatus.connected,
        last_seen: batteryStatus.timestamp,
      },
      pdu: {
        connected: pduStatus.connected,
        last_seen: pduStatus.timestamp,
      },
      gps: {
        connected: gpsStatus.connected,
        last_seen: gpsStatus.timestamp,
      },
      temperature_sensor: {
        connected: temperatureStatus.connected,
        last_seen: temperatureStatus.timestamp,
      },
      fan: {
        connected: fanStatus.connected,
        last_seen: fanStatus.timestamp,
      }
    };

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    // create and throw database errors
    const httpError = createError(406, "cannot query bot hardware status", { expose: true });
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
