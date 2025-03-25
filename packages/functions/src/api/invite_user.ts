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
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import db from '@chargebot-services/core/database';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { UserInviteStatus } from "@chargebot-services/core/database/user";
import { Cognito } from "@chargebot-services/core/services/aws/cognito";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const user_id = event.requestContext?.authorizer?.jwt.claims['cognito:username'] ?? event.requestContext?.authorizer?.jwt.claims['username'];
  const body = event.body;
  const now = new Date();
  const email_address = body.email_address as string;
  const phone_number = body.phone_number as string;
  const invite_method = email_address?.length > 0 ? 'email' : 'phone_number';

  try {
    if ((!phone_number || phone_number.length === 0) && (!email_address || email_address.length === 0)) {
      Log.debug(`Invalid user, email or phone number empty`);
      const httpError = createError(406, `Provider email or phone number`, { expose: true });
      throw httpError;
    }

    const [existentEmail, existentPhoneNumber, creator, existentCognito] = await Promise.all([
      User.findByEmail(email_address),
      User.findByPhone(phone_number),
      User.findByCognitoId(user_id),
      Cognito.getUserByUsername(phone_number ?? email_address),
    ]);

    if (existentEmail) {
      Log.debug(`User already exists with email ${email_address}`);
      const httpError = createError(406, `A user with email '${email_address}' was already invited`, { expose: true });
      throw httpError;
    }

    if (existentPhoneNumber) {
      Log.debug(`User already exists with phone number ${phone_number}`);
      const httpError = createError(406, `A user with phone number '${phone_number}' was already invited`, { expose: true });
      throw httpError;
    }

    if (existentCognito) {
      if (phone_number && await Cognito.deleteUser(phone_number) === false) {
        await Cognito.deleteUser(email_address);
      }
    }

    const created = await Cognito.createUser(email_address, phone_number, invite_method);
    if (!created?.cognitoUser) {
      Log.error(`Cannot create user on cognito ${email_address} - ${phone_number}`);
      const httpError = createError(406, `Cannot create user with email '${email_address}' or phone number '${phone_number}'`, { expose: true });
      throw httpError;
    }

    const audit = {
      created_by: user_id,
      created_date: now,
      modified_by: user_id,
      modified_date: now,
    };

    const user = await db.transaction().execute(async(trx) => {
      const new_user = await trx.insertInto('user')
        .values({
          invite_status: UserInviteStatus.INVITED,
          super_admin: false,
          user_id: created!.userId,
          company_id: body.company_id ?? creator!.company_id,
          onboarding: false,
          ...audit
        })
        .returningAll()
        .executeTakeFirst();

      // insert email
      if (email_address && email_address.length > 0) {
        await trx.insertInto('user_email')
          .values({
            email_address: email_address,
            user_id: new_user!.id!,
            primary: true,
            ...audit
          }).execute();
      }

      // insert phone number
      if (phone_number && phone_number.length > 0) {
        await trx.insertInto('user_phone')
          .values({
            phone_number: phone_number,
            user_id: new_user!.id!,
            primary: true,
            send_text: true,
            ...audit
          }).execute();
      }

      // insert role
      await trx.insertInto('user_role')
        .values({
          user_id: new_user!.id!,
          role_id: body.role_id,
          ...audit
        }).execute();

      // insert bots
      for (const bot_id of body.bot_ids) {
        await trx.insertInto('bot_user')
          .values({
            bot_id: bot_id,
            assignment_date: now,
            user_id: new_user!.id!,
            ...audit
          })
          .execute();
      }

      return new_user;
    }).catch(async (error) => {
      await Cognito.deleteUser(email_address);
      throw error;
    });

    return createSuccessResponse(user);

  } catch (error) {
    Log.error("ERROR", { error });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot invite user", { expose: true });
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
  .use(validator({ eventSchema: EntitySchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());