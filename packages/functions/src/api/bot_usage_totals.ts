import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { ResponseSchema } from "../schemas/bot_usage_totals.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, getNumber, isWarmingUp } from "../shared/rest_utils";
import { BotUUIDPathParamSchema } from "src/shared/schemas";
import { ChargebotInverter } from "@chargebot-services/core/services/analytics/chargebot_inverter";
import { DateTime } from "luxon";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;

  try {
    const monthStart = DateTime.now().setZone('UTC').startOf('month').toJSDate();
    const monthEnd = DateTime.now().setZone('UTC').endOf('month').toJSDate();

    const yearStart = DateTime.now().setZone('UTC').startOf('year').toJSDate();
    const yearEnd = DateTime.now().setZone('UTC').endOf('year').toJSDate();

    const [monthlyEnergyUsage, yearlyEnergyUsage, monthlyDays, yearlyMonths] = await Promise.all([
      ChargebotInverter.getMonthlyEnergyUsage(bot_uuid, monthStart, monthEnd),
      ChargebotInverter.getYearlyEnergyUsage(bot_uuid, yearStart, yearEnd),
      ChargebotInverter.getMonthlyEnergyUsageByDay(bot_uuid, monthStart, monthEnd),
      ChargebotInverter.getYearlyEnergyUsageByMonth(bot_uuid, yearStart, yearEnd),
    ]);

    const response = {
      bot_uuid: bot_uuid,
      monthly_energy_usage: getNumber(monthlyEnergyUsage?.value),
      yearly_energy_usage: getNumber(yearlyEnergyUsage?.value),
      monthly: monthlyDays && monthlyDays.length > 0 ? monthlyDays.map((dayOfMonth) => ({
        day_of_month: dayOfMonth.time.getUTCDate(),
        energy_usage: getNumber(dayOfMonth?.value)
      })) : [],
      yearly: yearlyMonths && yearlyMonths.length > 0 ? yearlyMonths.map((monthOfYear) => ({
        // getUTCMonth() returns an integer between 0 and 11
        month_of_year: monthOfYear.time.getUTCMonth() + 1,
        energy_usage: getNumber(monthOfYear?.value)
      })) : [],
    };

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    const httpError = createError(406, "cannot query bot usage totals ", { expose: true });
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
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());