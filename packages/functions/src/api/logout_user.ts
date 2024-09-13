import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { AppInstall } from "@chargebot-services/core/services/app_install";
import { SuccessResponseSchema } from "src/shared/schemas";
import Joi from "joi";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const app_install_id = +event.pathParameters!.app_install_id!;
  const user_id = event.requestContext?.authorizer?.jwt.claims.sub;
  const now = new Date();

  try {
    // find existent app install

    const appInstall = await AppInstall.get(app_install_id);

    if (!appInstall) {
      Log.debug('Install not found');
      return createNotFoundResponse("App install not found");
    }
    

    Log.debug('Existent Install, disable install');
    await AppInstall.update(appInstall.id!, {
      active: false,
      modified_by: user_id,
      modified_date: now,
    })

    return createSuccessResponse({ "response": "success" });
  } catch (error) {
    Log.error("ERROR", { error });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot logout user", { expose: true });
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
  .use(jsonBodyParser({ reviver: dateReviver }))
  .use(validator({ pathParametersSchema: Joi.object({
    app_install_id: Joi.number().required()
  })}))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: SuccessResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());
