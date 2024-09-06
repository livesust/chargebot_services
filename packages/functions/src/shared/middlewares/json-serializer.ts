import middy from '@middy/core';
import { DateTime } from "luxon";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^(?:(?:[01]?\d|2[0-3]):[0-5]\d(?:\s?[APap][Mm])?)$/;
  return timeRegex.test(time);
}

// Replacer function to convert Date objects to ISO 8601 format
const dateReplacer = (_: string, value: unknown) => {
  if (value instanceof Date) {
    // Convert Date objects to ISO 8601 format with timezone
    return DateTime.fromJSDate(value).toISO();
  }
  if (typeof value === 'string') {
    // Check if the string is in a valid date format
    // but is not a string representing an hour "HH:mm"
    const date = DateTime.fromISO(value) || DateTime.fromSQL(value) || DateTime.fromRFC2822(value) || DateTime.fromHTTP(value);
    if (date.isValid && !isValidTimeFormat(value)) {
      return date.toISO();
    }
  }
  return value;
};

const middleware = (parseDate: boolean = true): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
    const after: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
        request
    ): Promise<void> => {
        if (request.response?.body) {
            if (parseDate) {
                request.response.body = JSON.stringify(request.response.body, dateReplacer);
            } else {
                request.response.body = JSON.stringify(request.response.body);
            }
        }
    }

    return {
        after
    }
}

export default middleware;