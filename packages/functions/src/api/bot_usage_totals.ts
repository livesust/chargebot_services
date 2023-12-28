import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { ResponseSchema } from "../schemas/bot_monthly_usage.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { BotUUIDPathParamSchema } from "src/shared/schemas";
import { ChargebotInverter } from "@chargebot-services/core/services/analytics/chargebot_inverter";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;

  try {
    const [monthlyEnergyUsage, yearlyEnergyUsage, monthlyDays, yearlyMonths] = await Promise.all([
      ChargebotInverter.getMonthlyEnergyUsage(bot_uuid),
      ChargebotInverter.getYearlyEnergyUsage(bot_uuid),
      ChargebotInverter.getMonthlyEnergyUsageByDay(bot_uuid),
      ChargebotInverter.getYearlyEnergyUsageByMonth(bot_uuid),
    ]);

    const response = {
      bot_uuid: bot_uuid,
      monthly_energy_usage: monthlyEnergyUsage?.value ?? 0,
      yearly_energy_usage: yearlyEnergyUsage?.value ?? 0,
      monthly: monthlyDays && monthlyDays.length > 0 ? monthlyDays.map((dayOfMonth) => ({
        day_of_month: dayOfMonth.timestamp.getUTCDate(),
        energy_usage: dayOfMonth?.value ?? 0
      })) : [],
      yearly: yearlyMonths && yearlyMonths.length > 0 ? yearlyMonths.map((monthOfYear) => ({
        // getUTCMonth() returns an integer between 0 and 11
        month_of_year: monthOfYear.timestamp.getUTCMonth() + 1,
        energy_usage: monthOfYear?.value ?? 0
      })) : [],
    };

    return createSuccessResponse(response);
  } catch (error) {
    const httpError = createError(500, "cannot query bot usage totals ", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(validator({ pathParametersSchema: BotUUIDPathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());