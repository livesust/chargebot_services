import { expect, it } from "vitest";
import { initProject } from "sst/project";
import { App, getStack } from "sst/constructs";
import { ChargebotStack } from "../ChargebotStack";
import { Template } from "aws-cdk-lib/assertions";
import { RDSStack } from "../RDSStack";
import { CognitoStack } from "../CognitoStack";

it("Test ChargebotStack", async () => {
    await initProject({});
    const app = new App({ mode: "deploy" });
    // WHEN
    app.stack(RDSStack);
    app.stack(CognitoStack);
    app.stack(ChargebotStack);
    // THEN
    // @ts-expect-error ignore
    const template = Template.fromStack(getStack(ChargebotStack));
    expect(template).toBeDefined();
});