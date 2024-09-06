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
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { User } from "@chargebot-services/core/services/user";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { AppInstall } from "@chargebot-services/core/services/app_install";
import { Permission } from "@chargebot-services/core/services/permission";
import { AppInstallPermissions } from "@chargebot-services/core/services/app_install_permissions";
import { PermissionName } from "@chargebot-services/core/database/permission";


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

    Log.debug('User found', { cognito_id });

    // find existent app install
    const [existentAppInstall, notifificationPermission, locationPermission] = await Promise.all([
      AppInstall.findOneByCriteria({user_id: user.id, app_platform_id: body.app_platform_id}),
      Permission.findOneByCriteria({name: PermissionName.NOTIFICATIONS}),
      Permission.findOneByCriteria({name: PermissionName.LOCATION}),
    ]);

    if (existentAppInstall) {
      Log.debug('Existent Install, update');
    } else {
      Log.debug('New Install, create');
    }

    const [appInstall, appInstallPermissions] = await Promise.all([
      // update or create install
      existentAppInstall ? AppInstall.update(existentAppInstall.id!, {
        app_version: body.app_version,
        platform: body.platform,
        app_platform_id: body.app_platform_id,
        os_version: body.os_version,
        push_token: body.push_token,
        description: body.description,
        modified_by: user_id,
        modified_date: now,
      }) : AppInstall.create({
        ...body,
        user_id: user.id,
        created_by: user_id,
        created_date: now,
        modified_by: user_id,
        modified_date: now,
      }),
      // get app install permissions, or empty array if need to create them
      existentAppInstall ? AppInstallPermissions.findByCriteria({app_install_id: existentAppInstall.id!}) : Promise.resolve([]),
    ]);

    // search existent permissions, array will be empty if they do not exists
    const appNotificationPermission = appInstallPermissions?.filter(a => a.permission?.name === PermissionName.NOTIFICATIONS) ?? [];
    const appLocationsPermission = appInstallPermissions?.filter(a => a.permission?.name === PermissionName.LOCATION) ?? [];

    if (appNotificationPermission?.length > 0) {
      Log.debug('Update notification permission');
    } else {
      Log.debug('Create notification permission');
    }

    if (appLocationsPermission?.length > 0) {
      Log.debug('Update location permission');
    } else {
      Log.debug('Create location permission');
    }

    await Promise.all([
      // update/create app install permission for notifications
      appNotificationPermission?.length > 0 ? AppInstallPermissions.update(appNotificationPermission[0].id!, { permission_status: body.push_token ? true : false })
        : AppInstallPermissions.create({
          permission_status: false,
          permission_id: notifificationPermission!.id!,
          app_install_id: appInstall!.entity!.id!,
          created_by: user_id,
          created_date: now,
          modified_by: user_id,
          modified_date: now,
        }),
        // update/create app install permission for locations
        appLocationsPermission?.length > 0 ? Promise.resolve()
          : AppInstallPermissions.create({
            permission_status: false,
            permission_id: locationPermission!.id!,
            app_install_id: appInstall!.entity!.id!,
            created_by: user_id,
            created_date: now,
            modified_by: user_id,
            modified_date: now,
          })
    ]);

    return createSuccessResponse(appInstall!.entity);
  } catch (error) {
    Log.error("ERROR", { error });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot register app install", { expose: true });
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
  .use(jsonBodyParser({ reviver: dateReviver }))
  .use(validator({ eventSchema: EntitySchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());
