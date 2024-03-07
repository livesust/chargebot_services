import { expect, it } from "vitest";
import { initProject } from "sst/project";
import { App, getStack } from "sst/constructs";
import { ApiStack } from "../ApiStack";
import { Template } from "aws-cdk-lib/assertions";
import { RDSStack } from "../RDSStack";
import { CognitoStack } from "../CognitoStack";
import { LambdaStack } from "../LambdaStack";

it("Test ApiStack", async () => {
    await initProject({});
    const app = new App({ mode: "deploy" });
    // WHEN
    app.stack(RDSStack);
    app.stack(CognitoStack);
    app.stack(LambdaStack);
    app.stack(ApiStack);
    // THEN
    // @ts-expect-error ignore
    const template = Template.fromStack(getStack(ApiStack));
    expect(template).toBeDefined();
});