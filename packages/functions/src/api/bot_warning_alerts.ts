import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { BotUUIDPathParamSchema } from "../shared/schemas";
import { ArrayResponseSchema } from "../schemas/bot_warning_alerts.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotAlert } from "@chargebot-services/core/services/analytics/chargebot_alert";
import i18n from '../shared/i18n/i18n';

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;

  try {
    const alerts = await ChargebotAlert.getActiveWarningAlertsByBot(bot_uuid);
    
    const response = alerts?.map(alert => {
      const content = typeof(alert.message) === "string" ? JSON.parse(alert.message) : alert.message;
      const title = i18n.__(`push_alerts.${alert.name}.title`);
      const message = i18n.__(`push_alerts.${alert.name}.message`, content);
      return {
        timestamp: alert.timestamp,
        title,
        message
      }
    });

    return createSuccessResponse(response);
  } catch (error) {
    Log.error("ERROR", { error });
    console.log(JSON.stringify(error));
    const httpError = createError(406, "cannot query bot warning alerts", { expose: true });
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
  .use(jsonBodySerializer(false))
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ArrayResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());