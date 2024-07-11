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
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { Bucket } from "sst/node/bucket";
import { S3 } from "@chargebot-services/core/services/aws/s3";
import { User } from "@chargebot-services/core/services/user";
import { UserEmail } from "@chargebot-services/core/services/user_email";
import { UserPhone } from "@chargebot-services/core/services/user_phone";
import { UserRole } from "@chargebot-services/core/services/user_role";
import { HomeMaster } from "@chargebot-services/core/services/home_master";
import { BotUser } from "@chargebot-services/core/services/bot_user";

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
    const [homeMaster, userEmail, userPhone, userRole, photoUrl, userBots] = await Promise.all([
      HomeMaster.findByCompany(user.company_id),
      UserEmail.findOneByCriteria({user_id: user.id, primary: true}),
      UserPhone.findOneByCriteria({user_id: user.id, primary: true}),
      UserRole.findOneByCriteria({user_id: user.id}),
      S3.getDownloadUrl(Bucket.userProfile.bucketName, filename),
      BotUser.findByCriteria({user_id: user.id})
    ]);

    const response = {
      id: user?.id,
      invite_status: user?.invite_status,
      first_name: user?.first_name,
      last_name: user?.last_name,
      title: user?.title,
      photo: photoUrl,
      email_address: userEmail?.email_address,
      phone_number: userPhone?.phone_number,
      role_id: userRole?.role_id,
      role: userRole?.role?.role,
      onboarding: user?.onboarding ?? false,
      privacy_terms_last_accepted: user?.privacy_terms_last_accepted,
      privacy_terms_version: user?.privacy_terms_version,
      company: {
        ...user.company,
        customer: null,
        home_master: null
      },
      bot_ids: userBots.map((bot_user) => bot_user.bot_id),
      home_master: homeMaster
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
  // .use(executionTimeLogger())
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