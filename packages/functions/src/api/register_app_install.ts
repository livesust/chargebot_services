import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { EntitySchema, ResponseSchema } from "../schemas/app_install.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { AppInstall } from "@chargebot-services/core/services/app_install";
import { Permission } from "@chargebot-services/core/services/permission";
import { AppInstallPermissions } from "@chargebot-services/core/services/app_install_permissions";


// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const cognito_id = event.pathParameters!.cognito_id!;
  const user_id = event.requestContext?.authorizer?.jwt.claims.sub;
  const now = new Date();
  const body = event.body;

  try {
    const user = await User.findByCognitoId(cognito_id);
    if (!user) {
      Log.debug("User not found", { cognito_id });
      return createNotFoundResponse("User not found");
    }

    // find existent app install
    const appInstall = await AppInstall.findOneByCriteria({user_id: user.id, app_platform_id: body.app_platform_id})

    // update
    if (appInstall) {
      const response = await AppInstall.update(appInstall.id!, {
        push_token: body.push_token,
        app_version: body.app_version,
        platform: body.platform,
        os_version: body.os_version,
        description: body.description,
        modified_by: user_id,
        modified_date: now,
      });
      return createSuccessResponse(response!.entity);
    }

    // create
    const [response, permissions] = await Promise.all([
      AppInstall.create({
        ...body,
        user_id: user.id,
        created_by: user_id,
        created_date: now,
        modified_by: user_id,
        modified_date: now,
      }),
      Permission.list()
    ]);

    await Promise.all(
      permissions.map(async (permission) => {
        AppInstallPermissions.create({
          permission_status: false,
          permission_id: permission.id!,
          app_install_id: response!.entity!.id!,
          created_by: user_id,
          created_date: now,
          modified_by: user_id,
          modified_date: now,
        })
      })
    );

    return createSuccessResponse(response!.entity);

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
  .use(jsonBodyParser({ reviver: dateReviver }))
  .use(validator({ eventSchema: EntitySchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());