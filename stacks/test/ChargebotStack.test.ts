import { expect, it } from "vitest";
import { initProject } from "sst/project";
import { App, getStack } from "sst/constructs";
import { ChargebotStack } from "../ChargebotStack";
import { Template } from "aws-cdk-lib/assertions";

it("Test ChargebotStack", async () => {
    await initProject({});
    const app = new App({ mode: "deploy" });
    // WHEN
    app.stack(ChargebotStack);
    // THEN
    //@ts-ignore-next-line
    const template = Template.fromStack(getStack(ChargebotStack));
    expect(template).toBeDefined();
});