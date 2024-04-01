import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema, ArrayResponseSchema } from "../schemas/bot_usage_days_info.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { DateTime } from "luxon";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotInverter } from "@chargebot-services/core/services/analytics/chargebot_inverter";
import { getNumber } from "../shared/rest_utils";

interface DaysWithUsage {
  date: string;
  has_data: boolean;
}

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;
  const from_date = event.pathParameters!.from!;
  const to_date = event.pathParameters!.to!;
  const from = DateTime.fromISO(from_date).setZone('UTC').startOf('day').toJSDate();
  const to = DateTime.fromISO(to_date).setZone('UTC').endOf('day').toJSDate();

  try {
    const daysDetail = await ChargebotInverter.getDaysWithData(bot_uuid, from, to);

    const response: DaysWithUsage[] = [];

    daysDetail.forEach((obj) => {
      response.push({
        date: DateTime.fromJSDate(obj.bucket).setZone('UTC').toISO()!,
        has_data: getNumber(obj.number_of_records) > 0
      })
    });

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    const httpError = createError(406, "cannot query bot has usage data by day", { expose: true });
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
  .use(jsonBodySerializer(false))
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ArrayResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());