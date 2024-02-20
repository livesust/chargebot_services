import middy from '@middy/core';
import Log from '@dazn/lambda-powertools-logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Config } from "sst/node/config";
import CryptoES from 'crypto-es';

const hashKey = () => {
  const hash = CryptoES.SHA256(Config.SECRET_KEY);
  return hash;
};

// Encrypt function using Node.js crypto module
const decrypt = (ciphertext: string, ivBase64: string) => {
  try {
    // Convert the IV from hex to a Buffer
    const key = hashKey();

    const iv = CryptoES.enc.Hex.parse(ivBase64);

    const decrypted = CryptoES.AES.decrypt(ciphertext, key, {
      iv,
      mode: CryptoES.mode.CBC,
    });

    return CryptoES.enc.Utf8.stringify(decrypted);
  } catch (error) {
    Log.error('Error encrypting data:', { error });
    return null;
  }
}

const middleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
    request
  ): Promise<void> => {
    const { body, headers } = request.event;
    const iv = headers['x-encrypted-iv'];

    if (body && iv) {
      request.event.body = decrypt(body, iv);
    }
  }

  return {
    before
  }
}

export default middleware;