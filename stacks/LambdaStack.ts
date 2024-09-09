import { Config, StackContext, Function , use, Cron} from "sst/constructs";
import { RDSStack } from "./RDSStack";
import { TimescaleStack } from "./TimescaleStack";
import { LayerVersion, Code, Alias } from "aws-cdk-lib/aws-lambda";
import { PredefinedMetric, ScalableTarget, ServiceNamespace } from "aws-cdk-lib/aws-applicationautoscaling";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { IotToLambda, IotToLambdaProps } from "@aws-solutions-constructs/aws-iot-lambda";
import { Effect, IRole, Policy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { CfnPlaceIndex } from 'aws-cdk-lib/aws-location';
import { EventBusStack } from "./EventBusStack";

export function LambdaStack({ app, stack }: StackContext) {
  const { rdsCluster } = use(RDSStack);
  const { timescaleConfigs } = use(TimescaleStack);
  const { eventBus } = use(EventBusStack);

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

  // i18n layer: to manage localization
  const i18nLayer = new LayerVersion(stack, "i18n-layer", {
    code: Code.fromAsset("layers/i18n"),
  });

  // lambda functions timeout
  const timeout = app.stage === "prod" ? "10 seconds" : "30 seconds";

  // Expo Server Access Token for Push
  const EXPO_ACCESS_TOKEN = new Config.Secret(stack, "EXPO_ACCESS_TOKEN");

  // Cron function to send daily usage notifications, runs every 15min
  
  const processDailyUsageAlerts = new Function(stack, "chargebotDailyUsageAlerts", {
    handler: "packages/functions/src/api/send_daily_usage_notifications.main",
    timeout: "180 seconds",
    // @ts-expect-error ignore type errors
    layers: [expoServerSdkLayer, i18nLayer, luxonLayer],
    nodejs: {
      install: ["expo-server-sdk", "i18n", "luxon"],
    },
    bind: [
      rdsCluster,
      timescaleConfigs.TIMESCALE_HOST,
      timescaleConfigs.TIMESCALE_USER,
      timescaleConfigs.TIMESCALE_PASSWORD,
      timescaleConfigs.TIMESCALE_PORT,
      timescaleConfigs.TIMESCALE_DATABASE,
      EXPO_ACCESS_TOKEN
    ],
  });

  new Cron(stack, "DailyUsageNotificationCron", {
    schedule: "rate(15 minutes)",
    job: {
      function: processDailyUsageAlerts,
    }
  });

  /**
   * Subscribe to chargebot alerts and execute a lambda function
   */
  const processIotAlertsFunction = new Function(stack, "chargebotIotAlertProcess", {
    handler: "packages/functions/src/api/send_push_alert.main",
    timeout,
    // @ts-expect-error ignore type errors
    layers: [expoServerSdkLayer, i18nLayer],
    nodejs: {
      install: ["expo-server-sdk", "i18n"],
    },
    bind: [
      rdsCluster,
      timescaleConfigs.TIMESCALE_HOST,
      timescaleConfigs.TIMESCALE_USER,
      timescaleConfigs.TIMESCALE_PASSWORD,
      timescaleConfigs.TIMESCALE_PORT,
      timescaleConfigs.TIMESCALE_DATABASE,
      EXPO_ACCESS_TOKEN
    ],
  });

  const iotAlertLogGroup = new LogGroup(stack, `ChargebotIoTAlertLogGroup_${app.stage}`, {
    logGroupName: `ChargebotIoTAlertLogGroup_${app.stage}`,
    retention: RetentionDays.ONE_MONTH
  });

  const iotAlertErrorLogGroup = new LogGroup(stack, `ChargebotIoTAlertErrorLogGroup_${app.stage}`, {
    logGroupName: `ChargebotIoTAlertErrorLogGroup_${app.stage}`,
    retention: RetentionDays.ONE_MONTH
  });

  const iotAlertsToLambda: IotToLambdaProps = {
    // @ts-expect-error ignore typing
    existingLambdaObj: processIotAlertsFunction,
    iotTopicRuleProps: {
      topicRulePayload: {
        ruleDisabled: false,
        description: "ChargeBot alerts to Lambda",
        sql: "SELECT * FROM 'chargebot/alert/lambda'",
        actions: [
          {
            cloudwatchLogs: {
              logGroupName: iotAlertLogGroup.logGroupName,
              roleArn: 'arn:aws:iam::881739832873:role/livesust-iot-cluster-kms-role',
            }
          }
        ],
        errorAction:
        {
          cloudwatchLogs: {
            logGroupName: iotAlertErrorLogGroup.logGroupName,
            roleArn: 'arn:aws:iam::881739832873:role/livesust-iot-cluster-kms-role'
          }
        }
      }
    }
  };

  new IotToLambda(stack, `ChargebotIoTAlertRuleToLambda_${app.stage}`, iotAlertsToLambda);

  /**
   * Subscribe to chargebot command execution results and execute a lambda function
   */
  const processControlOutletResponseFunction = new Function(stack, "chargebotControlOutletResponseProcess", {
    handler: "packages/functions/src/api/control_outlet_result.main",
    timeout,
    bind: [rdsCluster],
  });

  const controlOutletResponseLogGroup = new LogGroup(stack, `ChargebotControlOutletResponseLogGroup_${app.stage}`, {
    logGroupName: `ChargebotControlOutletResponseLogGroup_${app.stage}`,
    retention: RetentionDays.ONE_MONTH
  });

  const controlOutletResponseErrorLogGroup = new LogGroup(stack, `ChargebotControlOutletResponseErrorLogGroup_${app.stage}`, {
    logGroupName: `ChargebotControlOutletResponseErrorLogGroup_${app.stage}`,
    retention: RetentionDays.ONE_MONTH
  });

  const controlOutletResponseToLambda: IotToLambdaProps = {
    // @ts-expect-error ignore typing
    existingLambdaObj: processControlOutletResponseFunction,
    iotTopicRuleProps: {
      topicRulePayload: {
        ruleDisabled: false,
        description: "ChargeBot control outlet response to Lambda",
        sql: "SELECT * FROM 'chargebot/control/+/outlet/result'",
        actions: [
          {
            cloudwatchLogs: {
              logGroupName: controlOutletResponseLogGroup.logGroupName,
              roleArn: 'arn:aws:iam::881739832873:role/livesust-iot-cluster-kms-role',
            }
          }
        ],
        errorAction:
        {
          cloudwatchLogs: {
            logGroupName: controlOutletResponseErrorLogGroup.logGroupName,
            roleArn: 'arn:aws:iam::881739832873:role/livesust-iot-cluster-kms-role'
          }
        }
      }
    }
  };

  new IotToLambda(stack, `ChargebotControlOutletResponseRuleToLambda_${app.stage}`, controlOutletResponseToLambda);

  /**
   * Subscribe to chargebot gps parked location and execute a lambda function
   */
  if ("staging" === app.stage) {
    // new CfnPlaceIndex(stack, 'ChargebotEsriPlaceIndex', {
    //   dataSource: 'Esri',
    //   indexName: 'ChargebotEsriPlaceIndex',
    
    //   // the properties below are optional
    //   dataSourceConfiguration: {
    //     intendedUse: 'Storage',
    //   },
    //   description: 'AWS Location Esri Place Index for Chargebot',
    // });

    new CfnPlaceIndex(stack, 'ChargebotHerePlaceIndex', {
      dataSource: 'Here',
      indexName: 'ChargebotHerePlaceIndex',
    
      // the properties below are optional
      dataSourceConfiguration: {
        intendedUse: 'Storage',
      },
      description: 'AWS Location Here Place Index for Chargebot',
    });
  }

  const geolocationAdminRole: IRole = new Role(stack, "GeolocationAdminRole", {
    assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    managedPolicies: [
      { managedPolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" },
    ],
  });
  const policy: Policy = new Policy(stack, "GeolocationAdminRolePolicy", {
    policyName: 'lambda_geolocation_policy',
    statements: [new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "geo:SearchPlaceIndexForPosition",  // reverse geocoding
        "geo:SearchPlaceIndexForText",      // geocoding
      ],
      resources: ["*"]
    })]
  });
  policy.attachToRole(geolocationAdminRole);

  const processIotGpsParkedFunction = new Function(stack, "chargebotIoTGpsParkedProcess", {
    handler: "packages/functions/src/api/process_iot_gps_parked.main",
    timeout,
    // @ts-expect-error ignore check
    role: geolocationAdminRole,
    bind: [
      timescaleConfigs.TIMESCALE_HOST,
      timescaleConfigs.TIMESCALE_USER,
      timescaleConfigs.TIMESCALE_PASSWORD,
      timescaleConfigs.TIMESCALE_PORT,
      timescaleConfigs.TIMESCALE_DATABASE,
    ],
  });

  /**
   * Subscribe to chargebot echo and execute a lambda function to auto discover devices
   */
  const processIotEchoFunction = new Function(stack, "chargebotIotEchoProcess", {
    handler: "packages/functions/src/api/bot_discovery.main",
    timeout,
    bind: [rdsCluster, eventBus],
  });

  const iotEchoLogGroup = new LogGroup(stack, `ChargebotIoTEchoLogGroup_${app.stage}`, {
    logGroupName: `ChargebotIoTEchoLogGroup_${app.stage}`,
    retention: RetentionDays.ONE_MONTH
  });

  const iotEchoErrorLogGroup = new LogGroup(stack, `ChargebotIoTEchoErrorLogGroup_${app.stage}`, {
    logGroupName: `ChargebotIoTEchoErrorLogGroup_${app.stage}`,
    retention: RetentionDays.ONE_MONTH
  });

  const iotEchoToLambda: IotToLambdaProps = {
    // @ts-expect-error ignore typing
    existingLambdaObj: processIotEchoFunction,
    iotTopicRuleProps: {
      topicRulePayload: {
        ruleDisabled: false,
        description: "ChargeBot echo discovery to Lambda",
        sql: "SELECT * FROM 'chargebot/+/echo'",
        actions: [
          {
            cloudwatchLogs: {
              logGroupName: iotEchoLogGroup.logGroupName,
              roleArn: 'arn:aws:iam::881739832873:role/livesust-iot-cluster-kms-role',
            }
          }
        ],
        errorAction:
        {
          cloudwatchLogs: {
            logGroupName: iotEchoErrorLogGroup.logGroupName,
            roleArn: 'arn:aws:iam::881739832873:role/livesust-iot-cluster-kms-role'
          }
        }
      }
    }
  };

  new IotToLambda(stack, `ChargebotIoTEchoRuleToLambda_${app.stage}`, iotEchoToLambda);

  // const iotGpsParkedlogGroup = new LogGroup(stack, `ChargebotIoTGpsParkedLogGroup_${app.stage}`, {
  //   logGroupName: `ChargebotIoTGpsParkedLogGroup_${app.stage}`,
  //   retention: RetentionDays.ONE_MONTH
  // });

  // const iotGpsParkedErrorLogGroup = new LogGroup(stack, `ChargebotIoTGpsParkedErrorLogGroup_${app.stage}`, {
  //   logGroupName: `ChargebotIoTGpsParkedErrorLogGroup_${app.stage}`,
  //   retention: RetentionDays.ONE_MONTH
  // });

  // const iotGpsParkedToLambda: IotToLambdaProps = {
  //   // @ts-expect-error ignore typing
  //   existingLambdaObj: processIotGpsParkedFunction,
  //   iotTopicRuleProps: {
  //     topicRulePayload: {
  //       ruleDisabled: false,
  //       description: "ChargeBot Gps Parked to Lambda",
  //       sql: "SELECT * FROM 'chargebot/status/gps'",
  //       actions: [
  //         {
  //           cloudwatchLogs: {
  //             logGroupName: iotGpsParkedlogGroup.logGroupName,
  //             roleArn: 'arn:aws:iam::881739832873:role/livesust-iot-cluster-kms-role',
  //           }
  //         }
  //       ],
  //       errorAction:
  //       {
  //         cloudwatchLogs: {
  //           logGroupName: iotGpsParkedErrorLogGroup.logGroupName,
  //           roleArn: 'arn:aws:iam::881739832873:role/livesust-iot-cluster-kms-role'
  //         }
  //       }
  //     }
  //   }
  // };

  // new IotToLambda(stack, `ChargebotIoTGpsParkedRuleToLambda_${app.stage}`, iotGpsParkedToLambda);

  return {
    lambdaLayers: {
      cryptoLayer,
      luxonLayer,
      sharpLayer,
      expoServerSdkLayer,
      i18nLayer,
    },
    functions: {
      processIotAlertsFunction,
      processDailyUsageAlerts,
      processIotGpsParkedFunction
    },
    setupProvisionedConcurrency,
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
