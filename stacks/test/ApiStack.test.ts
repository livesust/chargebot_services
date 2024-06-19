import { expect, it } from "vitest";
import { initProject } from "sst/project";
import { App, getStack } from "sst/constructs";
import { Template } from "aws-cdk-lib/assertions";
import { ApiStack } from "../ApiStack";
import { RDSStack } from "../RDSStack";
import { TimescaleStack } from "../TimescaleStack";
import { CognitoStack } from "../CognitoStack";
import { LambdaStack } from "../LambdaStack";
import { EventBusStack } from "../EventBusStack";
import { IotStack } from "../IotStack";

it("Test ApiStack", async () => {
    await initProject({});
    const app = new App({ mode: "deploy" });
    // WHEN
    app.stack(RDSStack);
    app.stack(TimescaleStack);
    app.stack(CognitoStack);
    app.stack(IotStack);
    app.stack(EventBusStack);
    app.stack(LambdaStack);
    app.stack(ApiStack);
    // THEN
    // @ts-expect-error ignore
    const template = Template.fromStack(getStack(ApiStack));
    expect(template).toBeDefined();
});