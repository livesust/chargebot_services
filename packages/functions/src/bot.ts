import middy from "@middy/core";
import validator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { createSchema, updateSchema, objectResponseSchema, arrayResponseSchema, statusCodeResponseSchema, idPathParamSchema } from "./schemas/bot.schema";
import httpResponseSerializer from "./serializer";
import { Bot } from "@chargebot-services/core/bot";

/**
 * CREATE
 */
const createHandler = async (event: any) => {
  console.log('Request to create Bot:', event);
  const response = await Bot.create(event.body);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: { result: "success" }
  };
};

const create = middy(createHandler)
  .use(jsonBodyParser())
  .use(httpResponseSerializer)
  .use(validator({ eventSchema: createSchema, responseSchema: statusCodeResponseSchema }))
  .use(httpErrorHandler());

/**
 * UPDATE
 */

const updateHandler = async (event: any) => {
  const id = +event.pathParameters!.id!;
  await Bot.update(id, event.body);
  const body = await Bot.get(id)
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body
  };
};

const update = middy(updateHandler)
  .use(jsonBodyParser())
  .use(httpResponseSerializer)
  .use(validator({ eventSchema: updateSchema, responseSchema: objectResponseSchema }))
  .use(httpErrorHandler());

/**
 * DELETE
 */
const removeHandler = async (event: any) => {
  await Bot.remove(+event.pathParameters!.id!);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: { result: "success" },
  };
};

const remove = middy(removeHandler)
  .use(httpResponseSerializer)
  .use(validator({ eventSchema: idPathParamSchema, responseSchema: objectResponseSchema }))
  .use(httpErrorHandler());

/**
 * GET
 */
const getHandler = async (event: any) => {
  const bot = await Bot.get(+event.pathParameters!.id!);

  if (!bot) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Not found" }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: bot,
  };
};

const get = middy(getHandler)
  .use(httpResponseSerializer)
  .use(validator({ eventSchema: idPathParamSchema, responseSchema: objectResponseSchema }))
  .use(httpErrorHandler());

/**
 * LIST
 */
const listHandler = async (event: any) => {
  const bots = await Bot.list();
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: bots
  };
};

const list = middy(listHandler)
  .use(httpResponseSerializer)
  .use(validator({ responseSchema: arrayResponseSchema }))
  .use(httpErrorHandler());

export { create, update, remove, get, list };