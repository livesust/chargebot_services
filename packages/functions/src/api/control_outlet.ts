import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError, HttpError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { ControlOutletSchema } from "../schemas/control_outlet.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { BotUUIDPathParamSchema, SuccessResponseSchema } from "src/shared/schemas";
import { Bot } from "@chargebot-services/core/services/bot";
import { Outlet } from "@chargebot-services/core/services/outlet";
import { IoTControl } from "@chargebot-services/core/services/iot/iot_control";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const bot_uuid = event.pathParameters!.bot_uuid!;
  const body = event.body;

  try {
    const bot = await Bot.findOneByCriteria({bot_uuid})

    if (!bot) {
      return createNotFoundResponse({ "response": "bot not found" });
    }

    const outlet = await Outlet.findOneByCriteria({ pdu_outlet_number: body.pdu_outlet_number, bot_id: bot.id });
    if (!outlet) {
      return createNotFoundResponse({ "response": "outlet not found" });
    }

    const sent = await IoTControl.sendCommand(bot_uuid, outlet.pdu_outlet_number, body.command)
    if (sent) {
      return createSuccessResponse({ "response": "success" });
    } else {
      throw createError(500, "error publishing command to device", { expose: true });
    }

  } catch (error) {
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(500, "cannot assign equipment to outlet", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  .use(jsonBodyParser({reviver: dateReviver}))
  .use(validator({
    pathParametersSchema: BotUUIDPathParamSchema,
    eventSchema: ControlOutletSchema
  }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(validator({ responseSchema: SuccessResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());