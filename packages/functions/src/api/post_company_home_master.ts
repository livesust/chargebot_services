import middy from "@middy/core";
import warmup from "@middy/warmup";
import Log from '@dazn/lambda-powertools-logger';
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { PathParamSchema } from "../schemas/company_home_master.schema";
import { ResponseSchema, EntitySchema } from "../schemas/home_master.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { HomeMaster } from "@chargebot-services/core/services/home_master";
import { Company } from "@chargebot-services/core/services/company";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { StateMaster } from "@chargebot-services/core/services/state_master";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const company_id = +event.pathParameters!.company_id!;
  const user_id = event.requestContext?.authorizer?.jwt.claims['cognito:username'] ?? event.requestContext?.authorizer?.jwt.claims['username'];
  const now = new Date();
  const body = event.body;

  try {
    const existent = await HomeMaster.findByCompany(company_id);

    if (body.state_name) {
      let state = await StateMaster.findOneByCriteria({name: body.state_name});
      if (!state) {
        state = (await StateMaster.create({
          name: body.state_name,
          country: body.country
        }))?.entity;
      }
      body.state_master_id = state!.id;
    }
    if (existent) {
      const update = (await HomeMaster.update(existent.id!, {
        address_line_1: body.address_line_1,
        address_line_2: body.address_line_2,
        city: body.city,
        zip_code: body.zip_code,
        place_id: body.place_id,
        latitude: body.latitude,
        longitude: body.longitude,
        state_master_id: body.state_master_id,
        modified_by: user_id,
        modified_date: now
      }))?.entity;
      return createSuccessResponse(update);
    }

    const [home_master, company] = await Promise.all([
      HomeMaster.create({
        address_line_1: body.address_line_1,
        address_line_2: body.address_line_2,
        city: body.city,
        zip_code: body.zip_code,
        place_id: body.place_id,
        latitude: body.latitude,
        longitude: body.longitude,
        state_master_id: body.state_master_id,
        created_by: user_id,
        created_date: now,
        modified_by: user_id,
        modified_date: now
      }),
      Company.lazyGet(company_id)
    ]);

    if (home_master?.entity) {
      await Company.update(company!.id!, {
        home_master_id: home_master.entity.id,
        modified_by: user_id,
        modified_date: now
      });
    }

    return createSuccessResponse(home_master?.entity);

  } catch (error) {
    Log.error("ERROR", { error });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot update company home", { expose: true });
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
  .use(validator({
    pathParametersSchema: PathParamSchema,
    eventSchema: EntitySchema
  }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: ResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());