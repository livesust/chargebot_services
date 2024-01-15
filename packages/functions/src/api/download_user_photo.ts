import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema } from "../schemas/update_user_profile.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import { S3 } from "@chargebot-services/core/services/aws/s3";
import { Bucket } from "sst/node/bucket";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const user_id = +event.pathParameters!.user_id!;

  try {
    const user = await User.get(user_id);
    if (!user) {
      return createNotFoundResponse("user not found");
    }
    
    const picture = await S3.getObject(Bucket.userBucket.bucketName, `profile_user_${user.id}`);

    return picture ? createSuccessResponse(picture) : createError(500, "Error downloading file from S3");

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
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());