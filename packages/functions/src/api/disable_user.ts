import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { EntitySchema } from "../schemas/disable_user.schema";
import { ResponseSchema } from "../schemas/user.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { UserInviteStatus } from "@chargebot-services/core/database/user";
import { Cognito } from "@chargebot-services/core/services/aws/cognito";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const user_sub = event.requestContext?.authorizer?.jwt.claims.sub;
  const body = event.body;

  try {
    let existentUser = await User.findByEmail(body.email_address);
    if (!existentUser) {
      Log.debug(`User ${body.email_address} does not exists`);
      return createNotFoundResponse(`User ${body.email_address} does not exists`);
    }

    const userDisabled = await Cognito.disableUser(body.email_address);

    if (!userDisabled) {
      const httpError = createError(406, "cannot disable user", { expose: true });
      throw httpError;
    }

    existentUser = (await User.update(existentUser.id!, {
      invite_status: UserInviteStatus.DISABLED,
      modified_by: user_sub,
      modified_date: new Date()
    }))?.entity;

    return createSuccessResponse(existentUser);

  } catch (error) {
    Log.error("ERROR", { error });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot disable user", { expose: true });
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
  .use(jsonBodyParser({ reviver: dateReviver }))
  .use(validator({ eventSchema: EntitySchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());