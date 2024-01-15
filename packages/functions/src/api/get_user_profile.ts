import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema, ResponseSchema } from "../schemas/update_user_profile.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import { UserEmail } from "@chargebot-services/core/services/user_email";
import { UserPhone } from "@chargebot-services/core/services/user_phone";
import { UserRole } from "@chargebot-services/core/services/user_role";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const user_id = +event.pathParameters!.user_id!;

  try {
    const user = await User.get(user_id);
    const userEmail = await UserEmail.findOneByCriteria({user_id, primary: true});
    const userPhone = await UserPhone.findOneByCriteria({user_id, primary: true});
    const userRole = await UserRole.findOneByCriteria({user_id});

    const response = {
      id: user?.id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      title: user?.title,
      photo: user?.photo,
      email_address: userEmail?.email_address,
      phone_number: userPhone?.phone_number,
      role_id: userRole?.role_id,
      role: userRole?.role?.role,
    };

    return createSuccessResponse(response);

  } catch (error) {
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(500, "cannot get user profile", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(validator({ pathParametersSchema: PathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());