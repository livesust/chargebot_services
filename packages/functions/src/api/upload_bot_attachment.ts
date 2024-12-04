import middy from "@middy/core";
import sharp from "sharp";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { S3 } from "@chargebot-services/core/services/aws/s3";
import { Bucket } from "sst/node/bucket";
import parser from "lambda-multipart-parser";
import Joi from "joi";
import { Bot } from "@chargebot-services/core/services/bot";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_id = event.pathParameters!.bot_id!;
  const fileContent = await parser.parse(event);  

  if (fileContent?.files?.length == 0) {
    return createNotFoundResponse("file missing");
  }

  const bot = await Bot.get(bot_id)
  if (!bot) {
    Log.debug("Bot not found", { bot_id });
    return createNotFoundResponse("Bot not found");
  }

  try {
    const file = fileContent.files[0];
    let fileBuffer = file.content;
    if (file.contentType !== 'application/pdf') {
      // Sharp images
      fileBuffer = await sharp(fileBuffer)
      .resize({
        width: 900,
        fit: "inside"
      })
      .jpeg({ mozjpeg: true })
      .toBuffer();
    }
    
    const upload = await S3.putObject(Bucket.botAttachments.bucketName, `bot_${bot.bot_uuid}_${file.filename}`, fileBuffer, file.contentType !== 'application/pdf' ? 'image/jpeg' : 'application/pdf');

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
  .use(validator({ pathParametersSchema: Joi.object({
    bot_id: Joi.string().required()
  }) }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());