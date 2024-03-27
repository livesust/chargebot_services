import { Config, StackContext, use, Function } from "sst/constructs";
import { LayerVersion, Code, Alias } from "aws-cdk-lib/aws-lambda";
import { PredefinedMetric, ScalableTarget, ServiceNamespace } from "aws-cdk-lib/aws-applicationautoscaling";
import { IotStack } from "./IotStack";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { IotToLambda, IotToLambdaProps } from "@aws-solutions-constructs/aws-iot-lambda";

export function LambdaStack({ app, stack }: StackContext) {
  const { iotRole, IOT_ENDPOINT } = use(IotStack);

  // Lambda layers
  // axios layer: to make http requests
  // const axiosLayer = new LayerVersion(stack, "axios-layer", {
  //   code: Code.fromAsset("layers/axios"),
  // });

  // crypto-es layer: to encrypt/decrypt data
  const cryptoLayer = new LayerVersion(stack, "crypto-es-layer", {
    code: Code.fromAsset("layers/crypto-es"),
  });

  // luxon layer: to manage dates
  const luxonLayer = new LayerVersion(stack, "luxon-layer", {
    code: Code.fromAsset("layers/luxon"),
  });

  // sharp layer: to resize images
  const sharpLayer = new LayerVersion(stack, "sharp-layer", {
    code: Code.fromAsset("layers/sharp"),
  });

  // sharp layer: to resize images
  const expoServerSdkLayer = new LayerVersion(stack, "expo-server-sdk-layer", {
    code: Code.fromAsset("layers/expo-server-sdk"),
  });

  // lambda functions timeout
  const timeout = app.stage === "prod" ? "10 seconds" : "30 seconds";

  // Lambda functions
  const botStatus = {
    handler: "packages/functions/src/api/bot_status.main",
    timeout,
    role: iotRole,
    bind: [IOT_ENDPOINT],
  };

  const botStatusEncrypted = {
    handler: "packages/functions/src/api/bot_status_encrypted.main",
    timeout,
    role: iotRole,
    bind: [IOT_ENDPOINT],
  };

  const botControl = {
    handler: "packages/functions/src/api/control_outlet.main",
    timeout,
    role: iotRole,
    bind: [IOT_ENDPOINT],
  };

  const botControlEncrypted = {
    handler: "packages/functions/src/api/control_outlet_encrypted.main",
    timeout,
    role: iotRole,
    bind: [IOT_ENDPOINT],
  };

  // Lambda function to execute when messages arrive to 'chargebot/alert' IoT topic

  // Expo Server Access Token for Push
  const EXPO_ACCESS_TOKEN = new Config.Secret(stack, "EXPO_ACCESS_TOKEN");

  const processIotAlertsFunction = new Function(stack, "chargebotIotAlertProcess", {
    handler: "packages/functions/src/api/send_push_alert.main",
    timeout,
    // @ts-expect-error ignore type errors
    layers: [expoServerSdkLayer],
    nodejs: {
      install: ["expo-server-sdk"],
    },
    bind: [EXPO_ACCESS_TOKEN],
  });

  let logGroup = LogGroup.fromLogGroupName(stack, `ChargebotIoTAlertLogGroup_${app.stage}`, `ChargebotIoTAlertLogGroup_${app.stage}`);
  if (!logGroup) {
    logGroup = new LogGroup(stack, `ChargebotIoTAlertLogGroup_${app.stage}`, {
      logGroupName: `ChargebotIoTAlertLogGroup_${app.stage}`,
      retention: RetentionDays.ONE_MONTH
    });
  }

  let errorLogGroup = LogGroup.fromLogGroupName(stack, `ChargebotIoTAlertErrorLogGroup_${app.stage}`, `ChargebotIoTAlertErrorLogGroup_${app.stage}`);
  if (!errorLogGroup) {
    errorLogGroup = new LogGroup(stack, `ChargebotIoTAlertErrorLogGroup_${app.stage}`, {
      logGroupName: `ChargebotIoTAlertErrorLogGroup_${app.stage}`,
      retention: RetentionDays.ONE_MONTH
    });
  }

  const constructProps: IotToLambdaProps = {
    // @ts-expect-error ignore typing
    existingLambdaObj: processIotAlertsFunction,
    iotTopicRuleProps: {
      topicRulePayload: {
        ruleDisabled: false,
        description: "Processing of ChargeBot alerts.",
        sql: "SELECT * FROM 'chargebot/alert'",
        actions: [
          {
            cloudwatchLogs: {
              logGroupName: logGroup.logGroupName,
              roleArn: 'arn:aws:iam::881739832873:role/livesust-iot-cluster-kms-role'
            }
          }
        ],
        errorAction:
        {
          cloudwatchLogs: {
            logGroupName: errorLogGroup.logGroupName,
            roleArn: 'arn:aws:iam::881739832873:role/livesust-iot-cluster-kms-role'
          }
        }
      }
    }
  };

  new IotToLambda(stack, `ChargebotIoTAlertRuleToLambda_${app.stage}`, constructProps);

  return {
    lambdaLayers: {
      cryptoLayer,
      luxonLayer,
      sharpLayer,
      expoServerSdkLayer,
    },
    lambdaFunctions: {
      botStatus,
      botStatusEncrypted,
      botControl,
      botControlEncrypted
    },
    setupProvisionedConcurrency
  };
}

function setupProvisionedConcurrency(stack, funct) {
  const version = funct.currentVersion

  const alias = new Alias(stack, `${funct.functionName}_LiveAlias`, {
    aliasName: "live",
    version: version,
    provisionedConcurrentExecutions: 1
  });

  // The code that defines your stack goes here
  const target = new ScalableTarget(stack, `${funct.functionName}_ScalableTarget`, {
    serviceNamespace: ServiceNamespace.LAMBDA,
    maxCapacity: 5,
    minCapacity: 1,
    resourceId: `function:${alias.lambda.functionName}:${alias.aliasName}`,
    scalableDimension: 'lambda:function:ProvisionedConcurrency'
  });

  target.node.addDependency(alias);

  target.scaleToTrackMetric(`${funct.functionName}_PcuTracking`, {
    targetValue: 0.8,
    predefinedMetric: PredefinedMetric.LAMBDA_PROVISIONED_CONCURRENCY_UTILIZATION
  });
}
