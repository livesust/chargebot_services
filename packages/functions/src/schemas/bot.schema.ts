import { transpileSchema } from '@middy/validator/transpile'

export const createSchema = transpileSchema({
  type: "object",
  required: ["body"],
  properties: {
    body: {
      type: "object",
      properties: {
        device_uuid: { type: "string", format: "uuid" },
        name: { type: "string", minLength: 1 },
        initials: { type: "string", minLength: 2, maxLength: 2 },
        color: { type: "string" },
      },
      required: ["device_uuid", "name", "initials", "color"],
    },
  },
});

export const updateSchema = transpileSchema({
  type: "object",
  required: ["pathParameters", "body"],
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        id: { type: "number" },
      },
      required: ["id"],
    },
    body: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1 },
        initials: { type: "string", minLength: 2, maxLength: 2 },
        color: { type: "string" },
      },
    },
  },
});

export const idPathParamSchema = transpileSchema({
  type: "object",
  required: ["pathParameters"],
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        id: { type: "number" },
      },
      required: ["id"],
    },
  },
});

export const statusCodeResponseSchema = transpileSchema({
  type: "object",
  required: ["statusCode"],
  properties: {
    statusCode: {
      type: "number",
    },
    headers: {
      type: "object",
    },
  },
});

export const objectResponseSchema = transpileSchema({
  type: "object",
  required: ["statusCode"],
  properties: {
    body: {
      type: ["object", "null"],
      properties: {
        id: { type: "number" },
        device_uuid: { type: "string", format: "uuid" },
        name: { type: "string", minLength: 1 },
        initials: { type: "string", minLength: 2, maxLength: 2 },
        color: { type: "string" },
      },
    },
    statusCode: {
      type: "number",
    },
    headers: {
      type: "object",
    },
  },
});

export const arrayResponseSchema = transpileSchema({
  type: "object",
  required: ["body", "statusCode"],
  properties: {
    body: {
      type: ["array", "null"],
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          device_uuid: { type: "string", format: "uuid" },
          name: { type: "string", minLength: 1 },
          initials: { type: "string", minLength: 2, maxLength: 2 },
          color: { type: "string" },
        },
      },
    },
    statusCode: {
      type: "number",
    },
    headers: {
      type: "object",
    },
  },
});