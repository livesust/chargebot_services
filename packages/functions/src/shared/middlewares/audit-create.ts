import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const middleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
    request
  ): Promise<void> => {
    const { body, requestContext } = request.event;

    const user_id = requestContext?.authorizer?.jwt.claims.sub;
    const now = new Date();

    request.event.body = Object.assign(
      body!,
      {
        created_by: user_id,
        created_date: now,
        modified_by: user_id,
        modified_date: now,
      }
    );
  }

  return {
    before
  }
}

export default middleware;