import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { DateTime } from "luxon";
import { PathParamSchema } from "../schemas/bot_location_history.schema";
import { ArrayResponseSchema } from "../schemas/bot_location_history.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotGps } from "@chargebot-services/core/services/analytics/chargebot_gps";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;
  const from = DateTime.fromISO(event.pathParameters!.from!).setZone('UTC');
  const to = DateTime.fromISO(event.pathParameters!.to!).setZone('UTC').endOf('day');

  try {
    let currentDay = from.startOf('day');
    const promises = [];
    while (currentDay <= to) {
      // Clone the input date to avoid modifying the original object
      const start = currentDay.toJSDate();
      const end = currentDay.endOf('day').toJSDate();

      const promise = (async () => {
        const [summary, route] = await Promise.all([
          ChargebotGps.getSummaryByBot(bot_uuid, start, end),
          ChargebotGps.getRouteByBot(bot_uuid, start, end),
        ]);

        return {
          bot_uuid,
          date: DateTime.fromJSDate(start).setZone('UTC').toISO(),
          summary,
          route
        };
      })();
    
      promises.push(promise);

      // Move to the next day
      currentDay = currentDay.plus({days: 1});
    }

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    return createSuccessResponse(results);
  } catch (error) {
    Log.error("ERROR", { error });
    const httpError = createError(406, "cannot query bot location ", { expose: true });
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
  .use(validator({ pathParametersSchema: PathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer(false))
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ArrayResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());