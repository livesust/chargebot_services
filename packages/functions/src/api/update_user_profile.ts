import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema, EntitySchema, ResponseSchema } from "../schemas/update_user_profile.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import { UserEmail } from "@chargebot-services/core/services/user_email";
import { UserPhone } from "@chargebot-services/core/services/user_phone";
import { UserRole } from "@chargebot-services/core/services/user_role";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const cognito_id = event.pathParameters!.cognito_id!;
  const user_sub = event.requestContext?.authorizer?.jwt.claims.sub;
  const body = event.body;

  try {
    const user = await User.findByCognitoId(cognito_id);
    if (!user) {
      Log.debug("User not found", { cognito_id });
      return createNotFoundResponse("User not found");
    }

    const promises = [];
    // update user info
    const update = {
      first_name: body.first_name,
      last_name: body.last_name,
      title: body.title,
      photo: body.photo,
      modified_by: user_sub,
      modified_date: new Date(),
    };
    promises.push(User.update(user.id!, update));

    // find user email, phone and role
    const [userEmail, userPhone, userRole] = await Promise.all([
      UserEmail.findOneByCriteria({user_id: user.id, primary: true}),
      UserPhone.findOneByCriteria({user_id: user.id, primary: true}),
      UserRole.findOneByCriteria({user_id: user.id})
    ]);

    // update/create primary email
    if (body.email_address) {
      if (!userEmail) {
        promises.push(UserEmail.create({
          email_address: body.email_address,
          user_id: user.id!,
          primary: true
        }));
      } else {
        promises.push(UserEmail.update(userEmail.id!, {
            email_address: body.email_address,
            modified_by: user_sub,
            modified_date: new Date(),
        }));
      }
    } else if (userEmail) {
        promises.push(UserEmail.remove(userEmail.id!, user_sub));
    }

    // update/create primary phone
    if (body.phone_number) {
      if (!userPhone) {
        promises.push(UserPhone.create({
          phone_number: body.phone_number,
          user_id: user.id!,
          primary: true
        }));
      } else {
        promises.push(UserPhone.update(userPhone.id!, {
            phone_number: body.phone_number,
            modified_by: user_sub,
            modified_date: new Date(),
        }));
      }
    } else if (userPhone) {
      promises.push(UserPhone.remove(userPhone.id!, user_sub));
    }

    // update/create role
    if (body.role_id) {
      if (!userRole) {
        promises.push(UserRole.create({
          user_id: user.id!,
          role_id: body.role_id,
        }));
      } else {
        promises.push(UserRole.update(userRole.id!, { role_id: body.role_id }));
      }
    }

    const [_, email, phone, role] = await Promise.all(promises);

    const response = {
      id: user.id!,
      ...update,
      //@ts-expect-error ignore uknown
      email_address: email?.entity?.email_address,
      //@ts-expect-error ignore uknown
      phone_number: phone?.entity?.phone_number,
      //@ts-expect-error ignore uknown
      role_id: role?.entity?.role_id,
    };

    return createSuccessResponse(response);

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
  .use(validator({ pathParametersSchema: PathParamSchema }))
  .use(jsonBodyParser({ reviver: dateReviver }))
  .use(validator({ eventSchema: EntitySchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());