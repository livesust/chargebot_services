import middy from "@middy/core";
import sharp from "sharp";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema } from "../schemas/update_user_profile.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import { S3 } from "@chargebot-services/core/services/aws/s3";
import { Bucket } from "sst/node/bucket";
import parser from "lambda-multipart-parser";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const cognito_id = event.pathParameters!.cognito_id!;
  const fileContent = await parser.parse(event);  

  if (fileContent?.files?.length == 0) {
    return createNotFoundResponse("file missing");
  }

  const user = await User.findByCognitoId(cognito_id);
  if (!user) {
    Log.debug("User not found", { cognito_id });
    return createNotFoundResponse("User not found");
  }

  try {
    const imageBuffer = fileContent.files[0].content;
    const resizedImage = await sharp(imageBuffer)
      .resize(400)
      .jpeg({ mozjpeg: true })
      .toBuffer();
    
    const upload = await S3.putObject(Bucket.userProfile.bucketName, `profile_user_${user.id}`, resizedImage, 'image/jpeg');

    return upload ? createSuccessResponse({ "response": "success" }) : createError(406, "Error uploading file to S3");

  } catch (error) {
    Log.error("ERROR", { error });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot upload user profile picture", { expose: true });
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
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());