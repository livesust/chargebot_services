import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError, HttpError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema } from "../schemas/assign_bot_company.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { SuccessResponseSchema } from "src/shared/schemas";
import { BotCompany } from "@chargebot-services/core/services/bot_company";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const company_id = +event.pathParameters!.company_id!;
  const bot_id = +event.pathParameters!.bot_id!;
  const user_id = event.requestContext?.authorizer?.jwt.claims.sub;

  try {
    const existentBotCompany = await BotCompany.lazyFindByCriteria({ bot_id });

    if (existentBotCompany.some(bc => bc.company_id === company_id)) {
      return createSuccessResponse({ "response": "bot already assigned to company" });
    }

    const promises = [];
    if (existentBotCompany?.length > 0) {
      existentBotCompany.map(async (bc) => {
        promises.push(BotCompany.remove(bc.id!, user_id))
      });      
    }

    const now = new Date();
    promises.push(BotCompany.create({
      bot_id: bot_id,
      company_id: company_id,
      acquire_date: now,
      created_by: user_id,
      created_date: now,
      modified_by: user_id,
      modified_date: now,
    }))

    await Promise.all(promises);

    return createSuccessResponse({ "response": "success" });

  } catch (error) {
    Log.error("ERROR", { error });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot assign bot to company", { expose: true });
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
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: SuccessResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());