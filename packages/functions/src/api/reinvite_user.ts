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
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { UserInviteStatus } from "@chargebot-services/core/database/user";
import { Cognito } from "@chargebot-services/core/services/aws/cognito";
import { BotUser } from "@chargebot-services/core/services/bot_user";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const user_sub = event.requestContext?.authorizer?.jwt.claims.sub;
  const body = event.body;
  const email_address = body.email_address;

  try {
    
    let existentUser = await User.findByEmail(email_address);
    if (!existentUser) {
      Log.debug(`User ${body.email_address} does not exists`);
      return createNotFoundResponse(`User ${body.email_address} does not exists`);
    }

    if (existentUser.invite_status != UserInviteStatus.EXPIRED && existentUser.invite_status != UserInviteStatus.INVITED) {
      Log.debug(`User ${body.email_address} is not invited/expired`);
      return createNotFoundResponse(`User ${body.email_address} is not invited/expired`);
    }

    // Enable on cognito
    const userEnabled = await Cognito.enableUser(body.email_address);
    if (!userEnabled) {
      const httpError = createError(406, "cannot re-invite user", { expose: true });
      throw httpError;
    }

    // Set status as invited
    existentUser = (await User.update(existentUser.id!, {
      invite_status: UserInviteStatus.INVITED,
      modified_by: user_sub,
      modified_date: new Date()
    }))?.entity;

    // Modify bots assigned to user
    if (body.bot_ids) {
      const assignedBots = await BotUser.findByCriteria({user_id: existentUser!.id!})
      const botsToAssign = body.bot_ids.filter((id: number) => !assignedBots.some(a => a.bot_id == id));
      const botsToRemove = assignedBots.map(b => b.bot_id).filter((id: number) => !body.bot_ids.some((bot_id: number) => bot_id == id))
      const now = new Date();
      await Promise.all([
        botsToRemove.map(async (bot_id: number) => BotUser.remove(bot_id, user_sub)),
        botsToAssign.map(async (bot_id: number) =>
          BotUser.create({
            bot_id: bot_id,
            assignment_date: now,
            user_id: existentUser!.id!,
            created_by: user_sub,
            created_date: now,
            modified_by: user_sub,
            modified_date: now,
          })
        )
      ]);
    }

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