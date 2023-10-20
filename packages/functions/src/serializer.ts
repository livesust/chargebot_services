
import httpResponseSerializer from '@middy/http-response-serializer';

const serializer = httpResponseSerializer({
  serializers: [
    {
      regex: /^application\/xml$/,
      serializer: ({ body }) => `<message>${body}</message>`,
    },
    {
      regex: /^application\/json$/,
      serializer: ({ body }) => JSON.stringify(body)
    },
    {
      regex: /^text\/plain$/,
      serializer: ({ body }) => body
    }
  ],
  defaultContentType: 'application/json'
});

export default serializer;