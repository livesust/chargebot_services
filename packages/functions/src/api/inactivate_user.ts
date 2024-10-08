import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { ResponseSchema } from "../schemas/user.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { UserInviteStatus } from "@chargebot-services/core/database/user";
import { Cognito } from "@chargebot-services/core/services/aws/cognito";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const cognito_id = event.pathParameters!.cognito_id!;
  const user_sub = event.requestContext?.authorizer?.jwt.claims.sub;

  try {
    let existentUser = await User.findByCognitoId(cognito_id);
    if (!existentUser) {
      Log.debug("User not found", { cognito_id });
      return createNotFoundResponse("User not found");
    }

    if (existentUser.invite_status != UserInviteStatus.ACTIVE && existentUser.invite_status != UserInviteStatus.INVITED) {
      Log.debug(`User ${cognito_id} is not invited/active`);
      return createNotFoundResponse(`User ${cognito_id} is not invited/active`);
    }

    // disable user
    const userDisabled = await Cognito.disableUser(cognito_id);
    if (!userDisabled) {
      const httpError = createError(406, "cannot disable user", { expose: true });
      throw httpError;
    }

    // save as inactive
    existentUser = (await User.update(existentUser.id!, {
      invite_status: UserInviteStatus.INACTIVE,
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
  // .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(jsonBodyParser({ reviver: dateReviver }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());