import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import inputOutputLogger from "@middy/input-output-logger";
import { PathParamSchema, ArrayResponseSchema } from "../schemas/bot_location_days_info.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import { DateTime } from "luxon";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { getNumber } from "../shared/rest_utils";
import { ChargebotGps } from "@chargebot-services/core/services/analytics/chargebot_gps";

interface DaysWithData {
  date: Date;
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
    const daysDetail = await ChargebotGps.getDaysWithData(bot_uuid, from, to);

    const response: DaysWithData[] = [];

    daysDetail.forEach((obj) => {
      response.push({
        date: DateTime.fromJSDate(obj.bucket).setZone('UTC').toJSDate(),
        has_data: getNumber(obj.number_of_records) > 0
      })
    });

    return createSuccessResponse(response);
  } catch (error) {
    const httpError = createError(406, "cannot query bot has location data by day", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(inputOutputLogger({
    omitPaths: ["event.headers", "event.requestContext", "response.headers", "response.body"]
  }))
  .use(httpEventNormalizer())
  .use(validator({ pathParametersSchema: PathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ArrayResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());