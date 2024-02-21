import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const middleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
    request
  ): Promise<void> => {
    const { body, requestContext } = request.event;

    const user_id = requestContext?.authorizer?.jwt.claims.sub;
    
    request.event.body = Object.assign(
        body!,
        {
            modified_by: user_id,
            modified_date: new Date(),
        }
    );
  }

  return {
    before
  }
}

export default middleware;