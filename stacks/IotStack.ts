import { StackContext, Config } from "sst/constructs";
import { Effect, IRole, Policy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export function IotStack({ stack }: StackContext) {

  const IOT_ENDPOINT = new Config.Secret(stack, "IOT_ENDPOINT");

  // lambda function to publish events into iot
  const iotRole: IRole = new Role(stack, "IoTRole", {
    assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
  });
  const iotPolicy: Policy = new Policy(stack, "IoTPolicy", {
    policyName: 'lambda_iot_policy',
    statements: [new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "iot:Connect",
        "iot:Publish",
        "iot:Subscribe",
        "iot:Receive",
      ],
      resources: ["*"]
    })]
  });
  iotPolicy.attachToRole(iotRole);

  return {
    iotRole,
    IOT_ENDPOINT
  };
}
