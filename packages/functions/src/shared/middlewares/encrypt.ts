import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Config } from "sst/node/config";
import CryptoES from 'crypto-es';

const hashKey = () => {
  const hash = CryptoES.SHA256(Config.SECRET_KEY);
  return hash;
};

export const encrypt = (plaintext: string) => {
  try {
    // Convert the IV from hex to a Buffer
    const key = hashKey();

    const iv = CryptoES.lib.WordArray.random(16);

    const encrypted = CryptoES.AES.encrypt(plaintext, key, {
      iv,
      mode: CryptoES.mode.CBC,
    });

    return {
      data: CryptoES.enc.Base64.stringify(encrypted.ciphertext!),
      iv: CryptoES.enc.Hex.stringify(encrypted.iv!),
    };
  } catch (error) {
    console.error('Error encrypting data:', error);
    return null;
  }
};

const middleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
    const after: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
        request
    ): Promise<void> => {
      if (request.response?.body) {
        request.response.body = JSON.stringify(encrypt(request.response.body));
      }
    }

    return {
        after
    }
}

export default middleware;