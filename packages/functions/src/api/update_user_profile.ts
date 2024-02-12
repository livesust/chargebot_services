import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema, EntitySchema, ResponseSchema } from "../schemas/update_user_profile.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import { UserEmail } from "@chargebot-services/core/services/user_email";
import { UserPhone } from "@chargebot-services/core/services/user_phone";
import { UserRole } from "@chargebot-services/core/services/user_role";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const user_id = +event.pathParameters!.user_id!;
  const user_sub = event.requestContext?.authorizer?.jwt.claims.sub;
  const body = event.body;

  try {
    const user = await User.get(user_id);
    if (!user) {
      return createNotFoundResponse("user not found");
    }

    // update user info
    const update = {
      first_name: body.first_name,
      last_name: body.last_name,
      title: body.title,
      photo: body.photo,
      modified_by: user_sub,
      modified_date: new Date(),
    };
    await User.update(user.id!, update);

    // find user email, phone and role
    const [userEmail, userPhone, userRole] = await Promise.all([
      UserEmail.findOneByCriteria({user_id, primary: true}),
      UserPhone.findOneByCriteria({user_id, primary: true}),
      UserRole.findOneByCriteria({user_id})
    ]);

    // update/create primary email
    const promises: Promise<{
      entity: unknown | undefined,
      event: unknown
    } | undefined>[] = [];

    if (!userEmail) {
      promises.push(UserEmail.create({
        email_address: body.email_address,
        user_id: user.id!,
        primary: true
      }));
    } else {
      promises.push(UserEmail.update(userEmail.id!, { email_address: body.email_address }));
    }

    // update/create primary phone
    if (!userPhone) {
      promises.push(UserPhone.create({
        phone_number: body.phone_number,
        user_id: user.id!,
        primary: true
      }));
    } else {
      promises.push(UserPhone.update(userPhone.id!, { phone_number: body.phone_number }));
    }

    // update/create role
    if (!userRole) {
      promises.push (UserRole.create({
        user_id: user.id!,
        role_id: body.role_id,
      }));
    } else {
      promises.push(UserRole.update(userRole.id!, { role_id: body.role_id }));
    }

    const [email, phone, role] = await Promise.all(promises);

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
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot get user profile", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(httpEventNormalizer())
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