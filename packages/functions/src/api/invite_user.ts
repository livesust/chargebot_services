import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { EntitySchema } from "../schemas/invite_user.schema";
import { ResponseSchema } from "../schemas/user.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import { UserEmail } from "@chargebot-services/core/services/user_email";
import { UserRole } from "@chargebot-services/core/services/user_role";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { UserInviteStatus } from "@chargebot-services/core/database/user";
import { Cognito } from "@chargebot-services/core/services/aws/cognito";
import { BotUser } from "@chargebot-services/core/services/bot_user";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const user_sub = event.requestContext?.authorizer?.jwt.claims.sub;
  const body = event.body;

  try {
    const [existent, creator] = await Promise.all([
      User.findByEmail(body.email_address),
      User.findByCognitoId(user_sub)
    ]);
    if (existent) {
      Log.debug(`User already exists with email ${body.email_address}`);
      const httpError = createError(406, `A user with email '${body.email_address}' was already invited`, { expose: true });
      throw httpError;
    }

    const cognitoUser = await Cognito.createUser(body.email_address);

    const user = (await User.create({
      invite_status: UserInviteStatus.INVITED,
      super_admin: false,
      user_id: cognitoUser!.Username!,
      company_id: creator!.company_id,
      onboarding: false
    }))?.entity;

    // create email and role
    const promises = [];

    promises.push(UserEmail.create({
      email_address: body.email_address,
      user_id: user!.id!,
      primary: true
    }));

    promises.push(UserRole.create({
      user_id: user!.id!,
      role_id: body.role_id,
    }));

    const now = new Date();
    promises.push(
      body.bot_ids.map(async (bot_id: number) =>
        BotUser.create({
          bot_id: bot_id,
          assignment_date: now,
          user_id: user!.id!,
          created_by: user_sub,
          created_date: now,
          modified_by: user_sub,
          modified_date: now,
        })
      )
    )

    await Promise.all(promises);

    return createSuccessResponse(user);

  } catch (error) {
    Log.error("ERROR", { error });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot update user profile", { expose: true });
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