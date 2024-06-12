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
import db from '@chargebot-services/core/database';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { UserInviteStatus } from "@chargebot-services/core/database/user";
import { Cognito } from "@chargebot-services/core/services/aws/cognito";
import { ScheduledAlert as ScheduledAlertService } from "@chargebot-services/core/services/scheduled_alert";
import { sql } from "kysely";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const user_sub = event.requestContext?.authorizer?.jwt.claims.sub;
  const body = event.body;
  const now = new Date();
  const email_address = body.email_address;

  try {
    const [existentLocal, creator, existentCognito, scheduledAlerts] = await Promise.all([
      User.findByEmail(email_address),
      User.findByCognitoId(user_sub),
      Cognito.getUserByEmail(email_address),
      ScheduledAlertService.list()
    ]);

    if (existentLocal) {
      Log.debug(`User already exists with email ${email_address}`);
      const httpError = createError(406, `A user with email '${email_address}' was already invited`, { expose: true });
      throw httpError;
    }

    if (existentCognito) {
      await Cognito.deleteUser(email_address);
    }

    const cognitoUser = await Cognito.createUser(email_address);
    if (!cognitoUser) {
      Log.error(`Cannot create email on cognito ${email_address}`);
      const httpError = createError(406, `Cannot create user with email '${email_address}'`, { expose: true });
      throw httpError;
    }

    const audit = {
      created_by: user_sub,
      created_date: now,
      modified_by: user_sub,
      modified_date: now,
    };

    const user = await db.transaction().execute(async(trx) => {
      const new_user = await trx.insertInto('user')
        .values({
          invite_status: UserInviteStatus.INVITED,
          super_admin: false,
          user_id: cognitoUser!.Username!,
          company_id: creator!.company_id,
          onboarding: false,
          ...audit
        })
        .returningAll()
        .executeTakeFirst();

      // insert email
      await trx.insertInto('user_email')
        .values({
          email_address: email_address,
          user_id: new_user!.id!,
          primary: true,
          ...audit
        }).execute();

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

      // insert scheduled alerts
      for (const alert of scheduledAlerts) {
        // @ts-expect-error ignore error
        const attrs = Object.keys(alert.config_settings);
        const scheduled = {
          user_id: new_user!.id!,
          scheduled_alert_id: alert.id!,
          alert_status: true,
          settings: alert.config_settings ? attrs.reduce((acc, key) => {
            // @ts-expect-error ignore error
            acc[key] = alert.config_settings![key].default;
            return acc;
          }, {}) : undefined,
          ...audit
        };
        await trx.insertInto('user_scheduled_alerts')
          .values({
            ...scheduled,
            settings: sql`CAST(${JSON.stringify(scheduled.settings)} AS JSONB)`
          })
          .execute()
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