

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
import { ChargebotAnalysis } from "@chargebot-services/core/services/analytics/chargebot_analysis";
import { SystemVariables } from "@chargebot-services/core/timescale/chargebot_system";

// @ts-expect-error ignore any type for event
export const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;

  try {
    const hardwareStatus = await ChargebotAnalysis.getHardwareStatus(bot_uuid);

    // convert values from kWh to Wh
    const connected = hardwareStatus.find(s => s.variable === SystemVariables.CONNECTED);
    const iotConnectedTime = connected?.timestamp;
    
    const response = {
      bot_uuid,
      iot: {
        connected: connected?.value === 1 ?? false,
        last_seen: iotConnectedTime ? DateTime.fromJSDate(iotConnectedTime).setZone('UTC').toISO() : null
      },
      pi: {
        cpu: getNumber(hardwareStatus.find(s => s.variable === SystemVariables.CPU)?.value),
        memory: getNumber(hardwareStatus.find(s => s.variable === SystemVariables.MEMORY)?.value),
        disk: getNumber(hardwareStatus.find(s => s.variable === SystemVariables.DISK)?.value),
        temperature: getNumber(hardwareStatus.find(s => s.variable === SystemVariables.TEMPERATURE)?.value),
        uptime: getNumber(hardwareStatus.find(s => s.variable === SystemVariables.UPTIME_MINUTES)?.value),
        undervoltage: getNumber(hardwareStatus.find(s => s.variable === SystemVariables.UNVERVOLTAGE)?.value),
      },
      inverter: {
        connected: hardwareStatus.find(s => s.variable === 'inverter_last_seen')?.value === 1,
        last_seen: hardwareStatus.find(s => s.variable === 'inverter_last_seen')?.timestamp,
      },
      battery: {
        connected: hardwareStatus.find(s => s.variable === 'battery_last_seen')?.value === 1,
        last_seen: hardwareStatus.find(s => s.variable === 'battery_last_seen')?.timestamp,
      },
      pdu: {
        connected: hardwareStatus.find(s => s.variable === 'pdu_last_seen')?.value === 1,
        last_seen: hardwareStatus.find(s => s.variable === 'pdu_last_seen')?.timestamp,
      },
      gps: {
        connected: hardwareStatus.find(s => s.variable === 'gps_last_seen')?.value === 1,
        last_seen: hardwareStatus.find(s => s.variable === 'gps_last_seen')?.timestamp,
      },
      temperature_sensor: {
        connected: hardwareStatus.find(s => s.variable === 'temperature_last_seen')?.value === 1,
        last_seen: hardwareStatus.find(s => s.variable === 'temperature_last_seen')?.timestamp,
      },
      fan: {
        connected: hardwareStatus.find(s => s.variable === 'fan_last_seen')?.value === 1,
        last_seen: hardwareStatus.find(s => s.variable === 'fan_last_seen')?.timestamp,
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
