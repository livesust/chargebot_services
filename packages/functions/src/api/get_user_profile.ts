import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema, ResponseSchema } from "../schemas/update_user_profile.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { Bucket } from "sst/node/bucket";
import { S3 } from "@chargebot-services/core/services/aws/s3";
import { User } from "@chargebot-services/core/services/user";
import { UserEmail } from "@chargebot-services/core/services/user_email";
import { UserPhone } from "@chargebot-services/core/services/user_phone";
import { UserRole } from "@chargebot-services/core/services/user_role";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const cognito_id = event.pathParameters!.cognito_id!;

  try {
    const user = await User.findOneByCriteria({user_id: cognito_id});

    if (!user) {
      Log.debug("User not found", { cognito_id });
      return createNotFoundResponse("User not found");
    }

    const filename = `profile_user_${user?.id}`;
    const [userEmail, userPhone, userRole, photoUrl] = await Promise.all([
      await UserEmail.findOneByCriteria({user_id: user.id, primary: true}),
      await UserPhone.findOneByCriteria({user_id: user.id, primary: true}),
      await UserRole.findOneByCriteria({user_id: user.id}),
      await S3.getDownloadUrl(Bucket.UserData.bucketName, filename),
    ]);

    const response = {
      id: user?.id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      title: user?.title,
      photo: photoUrl,
      email_address: userEmail?.email_address,
      phone_number: userPhone?.phone_number,
      role_id: userRole?.role_id,
      role: userRole?.role?.role,
      company: user?.company,
      home_master: user?.company?.home_master
    };

    return createSuccessResponse(response);

  } catch (error) {
    Log.error("ERROR", { error });
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
  .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(validator({ pathParametersSchema: PathParamSchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());