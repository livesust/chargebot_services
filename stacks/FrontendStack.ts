import { NextjsSite, StackContext, use } from "sst/constructs";
import { CognitoStack } from "./CognitoStack";
import { ChargebotStack } from "./ChargebotStack";
export function FrontendStack({ app, stack }: StackContext) {
  const { api } = use(ChargebotStack);
  const { cognito } = use(CognitoStack);

  const site = new NextjsSite(stack, "ChargebotWebApp", {
    path: "packages/frontend/chargebot-webapp",,
    environment: {
      API_URL: api.url,
      REGION: app.region,
      USER_POOL_ID: cognito.userPoolId,
      USER_POOL_CLIENT_ID: cognito.userPoolClientId,
      IDENTITY_POOL_ID: cognito.cognitoIdentityPoolId || "",
    }
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });

  return {
    site,
  };
}