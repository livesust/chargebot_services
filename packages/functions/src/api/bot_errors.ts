import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { BotUUIDPathParamSchema } from "../shared/schemas";
import { ResponseSchema } from "../schemas/bot_errors.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotError } from "@chargebot-services/core/services/analytics/chargebot_error";
import i18n from '../shared/i18n/i18n';

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;

  try {
    const [active, past] = await Promise.all([
      ChargebotError.getActiveErrors(bot_uuid),
      ChargebotError.getPastErrors(bot_uuid)
    ]);
    
    const response = {
      bot_uuid,
      active: active?.map((error) => {
        const title = i18n.__(`errors.${error.module}.${error.name}.title`);
        const message = i18n.__(`errors.${error.module}.${error.name}.message`, {device_id: bot_uuid});
        return {
          ...error,
          title,
          message,
          error_status: i18n.__(`errors.status.${error.error_status}`),
          level: i18n.__(`errors.level.${error.level}`),
          module: i18n.__(`errors.level.${error.module}`),
          severity: error.level === 'HIGH' ? i18n.__(`errors.severity.URGENT`) : i18n.__(`errors.severity.INFO`)
        }
      }),
      past: past?.map((error) => {
        const title = i18n.__(`errors.${error.module}.${error.name}.title`);
        const message = i18n.__(`errors.${error.module}.${error.name}.message`, {device_id: bot_uuid});
        return {
          ...error,
          title,
          message,
          error_status: i18n.__(`errors.status.${error.error_status}`),
          level: i18n.__(`errors.level.${error.level}`),
          module: i18n.__(`errors.level.${error.module}`),
          severity: error.level === 'HIGH' ? i18n.__(`errors.severity.URGENT`) : i18n.__(`errors.severity.INFO`)
        }
      }),
    };

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    console.log(JSON.stringify(error));
    const httpError = createError(406, "cannot query bot outlets ", { expose: true });
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
  .use(validator({ pathParametersSchema: BotUUIDPathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer(false))
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());