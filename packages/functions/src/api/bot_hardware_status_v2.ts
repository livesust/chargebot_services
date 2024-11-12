

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
import { BotUUIDPathParamSchema } from "src/shared/schemas";
import { DateTime } from "luxon";
import { ChargebotBotStatus } from "@chargebot-services/core/services/analytics/chargebot_bot_status";
import { SystemVariables } from "@chargebot-services/core/timescale/chargebot_system";
import { BotComponents } from "@chargebot-services/core/timescale/chargebot_bot_status";

// @ts-expect-error ignore any type for event
export const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;

  try {
    const [hardwareStatus, piStatus] = await Promise.all([
      ChargebotBotStatus.getHardwareStatus(bot_uuid),
      ChargebotBotStatus.getPiStatus(bot_uuid)
    ]);

    // convert values from kWh to Wh
    const connected = piStatus.find(s => s.variable === SystemVariables.CONNECTED);
    
    const inverterStatus = hardwareStatus.find(s => s.component === BotComponents.INVERTER);
    const batteryStatus = hardwareStatus.find(s => s.component === BotComponents.BATTERY);
    const pduStatus = hardwareStatus.find(s => s.component === BotComponents.PDU);
    const gpsStatus = hardwareStatus.find(s => s.component === BotComponents.GPS);
    const temperatureStatus = hardwareStatus.find(s => s.component === BotComponents.TEMPERATURE);
    const fanStatus = hardwareStatus.find(s => s.component === BotComponents.FAN);

    const response = {
      bot_uuid,
      iot: {
        connected: connected?.value === 1 ?? false,
        last_seen: connected?.timestamp ? DateTime.fromJSDate(connected?.timestamp).setZone('UTC').toISO() : null
      },
      pi: {
        cpu: getNumber(piStatus.find(s => s.variable === SystemVariables.CPU)?.value),
        memory: getNumber(piStatus.find(s => s.variable === SystemVariables.MEMORY)?.value),
        disk: getNumber(piStatus.find(s => s.variable === SystemVariables.DISK)?.value),
        temperature: getNumber(piStatus.find(s => s.variable === SystemVariables.TEMPERATURE)?.value),
        uptime: getNumber(piStatus.find(s => s.variable === SystemVariables.UPTIME_MINUTES)?.value),
        undervoltage: getNumber(piStatus.find(s => s.variable === SystemVariables.UNVERVOLTAGE)?.value),
      },
      inverter: {
        connected: inverterStatus?.connected,
        last_seen: inverterStatus?.timestamp ? DateTime.fromJSDate(inverterStatus?.timestamp).setZone('UTC').toISO() : null,
      },
      battery: {
        connected: batteryStatus?.connected,
        last_seen: batteryStatus?.timestamp ? DateTime.fromJSDate(batteryStatus?.timestamp).setZone('UTC').toISO() : null,
      },
      pdu: {
        connected: pduStatus?.connected,
        last_seen: pduStatus?.timestamp ? DateTime.fromJSDate(pduStatus?.timestamp).setZone('UTC').toISO() : null,
      },
      gps: {
        connected: gpsStatus?.connected,
        last_seen: gpsStatus?.timestamp ? DateTime.fromJSDate(gpsStatus?.timestamp).setZone('UTC').toISO() : null,
      },
      temperature_sensor: {
        connected: temperatureStatus?.connected,
        last_seen: temperatureStatus?.timestamp ? DateTime.fromJSDate(temperatureStatus?.timestamp).setZone('UTC').toISO() : null,
      },
      fan: {
        connected: fanStatus?.connected,
        last_seen: fanStatus?.timestamp ? DateTime.fromJSDate(fanStatus?.timestamp).setZone('UTC').toISO() : null,
      }
    };

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    // create and throw database errors
    const httpError = createError(406, `cannot query bot hardware status: ${error}`, { expose: true });
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
