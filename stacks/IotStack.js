import { Config } from "sst/constructs";
import { Effect, Policy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
export function IotStack({ stack }) {
    const IOT_ENDPOINT = new Config.Secret(stack, "IOT_ENDPOINT");
    // lambda function to publish events into iot
    const iotRole = new Role(stack, "IoTRole", {
        assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
            { managedPolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" },
        ],
    });
    const iotPolicy = new Policy(stack, "IoTPolicy", {
        policyName: 'lambda_iot_policy',
        statements: [new PolicyStatement({
                effect: Effect.ALLOW,
                actions: [
                    "iot:Connect",
                    "iot:Publish",
                    "iot:Subscribe",
                    "iot:Receive",
                    "iot:ListNamedShadowsForThing",
                    "iot:GetThingShadow",
                    "iot:UpdateThingShadow",
                    "iot:DeleteThingShadow"
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
