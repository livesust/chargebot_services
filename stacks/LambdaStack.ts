import { StackContext } from "sst/constructs";
import { LayerVersion, Code } from "aws-cdk-lib/aws-lambda";

export function LambdaStack({ stack }: StackContext) {

  // Lambda layers
  // axios layer: to make http requests
  // const axiosLayer = new LayerVersion(stack, "axios-layer", {
  //   code: Code.fromAsset("layers/axios"),
  // });

  // crypto-es layer: to encrypt/decrypt data
  const cryptoLayer = new LayerVersion(stack, "crypto-es-layer", {
    code: Code.fromAsset("layers/crypto-es"),
  });

  // luxon layer: to manage dates
  const luxonLayer = new LayerVersion(stack, "luxon-layer", {
    code: Code.fromAsset("layers/luxon"),
  });

  // sharp layer: to resize images
  const sharpLayer = new LayerVersion(stack, "sharp-layer", {
    code: Code.fromAsset("layers/sharp"),
  });

  // sharp layer: to resize images
  const expoServerSdk = new LayerVersion(stack, "expo-server-sdk-layer", {
    code: Code.fromAsset("layers/expo-server-sdk"),
  });

  return {
    cryptoLayer,
    luxonLayer,
    sharpLayer,
    expoServerSdk
  };
}
