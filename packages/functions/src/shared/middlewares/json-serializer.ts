import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const middleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
    const after: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
        request
    ): Promise<void> => {
        if (request.response?.body) {
            request.response.body = JSON.stringify(request.response.body);
        }
    }

    return {
        after
    }
}

export default middleware;