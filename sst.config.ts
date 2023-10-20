import { SSTConfig } from "sst";
import { ChargebotStack } from "./stacks/ChargebotStack";

export default {
  config(_input) {
    return {
      name: "chargebot-services",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(ChargebotStack);
  }
} satisfies SSTConfig;
