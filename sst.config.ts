import { SSTConfig } from "sst";
import { RDSStack } from "./stacks/RDSStack";
import { CognitoStack } from "./stacks/CognitoStack";
import { ChargebotStack } from "./stacks/ChargebotStack";
import { FrontendStack } from "./stacks/FrontendStack";

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
    app.stack(ChargebotStack);
    app.stack(FrontendStack);
  }
} satisfies SSTConfig;
