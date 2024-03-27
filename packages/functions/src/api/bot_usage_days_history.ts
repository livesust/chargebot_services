import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema, ResponseSchema } from "../schemas/bot_usage_interval.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { DateTime } from "luxon";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { HourlyUsage, getUsageByDay } from "./bot_usage_by_day";

interface DailyUsage {
  timestamp: Date,
  energy_usage: number,
  total_charging: number,
  grid_charging: number,
  solar_charging: number,
  battery_level: number,
  hourly: HourlyUsage[]
}

interface RangeUsage {
  usage: DailyUsage[]
}

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;
  const from_date = event.pathParameters!.from!;
  const to_date = event.pathParameters!.to!;
  const from = DateTime.fromISO(from_date).setZone('UTC');
  const to = DateTime.fromISO(to_date).setZone('UTC').endOf('day');

  try {
    const response: RangeUsage = {
      usage: []
    };

    let currentDay = from.startOf('day');
    const promises = [];
    while (currentDay <= to) {
      // Clone the input date to avoid modifying the original object
      const start = currentDay.toJSDate();
      const end = currentDay.endOf('day').toJSDate();

      const promise = (async () => getUsageByDay(bot_uuid, start, end))();
      promises.push(promise);

      // Move to the next day
      currentDay = currentDay.plus({days: 1});
    }

    // Wait for all promises to resolve
    response.usage = await Promise.all(promises);

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    const httpError = createError(406, "cannot query bot usage by day", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(validator({ pathParametersSchema: PathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());