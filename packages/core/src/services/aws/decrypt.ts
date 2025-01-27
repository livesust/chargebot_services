export * as AwsDecrypt from "./decrypt";
import { buildClient, KmsKeyringNode, CommitmentPolicy } from "@aws-crypto/client-node";
import Log from '@dazn/lambda-powertools-logger';
import { Config } from "sst/node/config";

const {decrypt} = buildClient(CommitmentPolicy.REQUIRE_ENCRYPT_ALLOW_DECRYPT);
const keyring = new KmsKeyringNode({
  generatorKeyId: Config.COGNITO_KMS_SECRET_ARN, //Config.COGNITO_KMS_SECRET_ALIAS,
  keyIds: [Config.COGNITO_KMS_SECRET_KEY_ID]
});

export async function decryptCiphertext(ciphertext: string) {
  try {
    const { plaintext } = await decrypt(keyring, Buffer.from(ciphertext, "base64"));
    return plaintext ? Buffer.from(plaintext).toString() : null;
  } catch (error) {
    // @ts-expect-error ignore
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    Log.error('Error decrypt', { requestId, cfId, extendedRequestId, error });
  }
}