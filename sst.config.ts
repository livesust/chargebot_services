import { SSTConfig } from "sst";
import { RDSStack } from "./stacks/RDSStack";
import { CognitoStack } from "./stacks/CognitoStack";
import { ApiStack } from "./stacks/ApiStack";
import { LambdaStack } from "./stacks/LambdaStack";

export default {
  config(_input) {
    return {
      name: "chargebot-services",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(RDSStack);
    app.stack(CognitoStack);
    app.stack(LambdaStack);
    app.stack(ApiStack);
  }
} satisfies SSTConfig;
