import middy from '@middy/core';
import Log from '@dazn/lambda-powertools-logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DateTime } from 'luxon';

// @ts-expect-error ignore
const hasTimer = (context) => {
  return context.lambdaStartTimeTimeLogMiddleware &&
    context.lambdaStartTimeTimeLogMiddleware.startTime
}

const middleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
    request
  ): Promise<void> => {
    const startTime = DateTime.utc();
    Object.defineProperty(request.context, 'lambdaStartTimeTimeLogMiddleware', {
      enumerable: false,
      value: { startTime }
    })
  }

  const after: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
    request
  ): Promise<void> => {
    const endTime = DateTime.utc();
    if (hasTimer(request.context)) {
      // @ts-expect-error ignore
      const startTime = request.context.lambdaStartTimeTimeLogMiddleware.startTime;
      Log.info('Execution Time', {time: endTime.toSeconds() - startTime.toSeconds()})
    }
  }

  return {
    before, after
  }
}

export default middleware;