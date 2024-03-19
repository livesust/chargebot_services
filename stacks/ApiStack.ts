import { StackContext, Config, Api, EventBus, Bucket, Function, use } from "sst/constructs";
import { RDSStack } from "./RDSStack";
import { CognitoStack } from "./CognitoStack";
import { LambdaStack } from "./LambdaStack";

import { Effect, IRole, Policy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { IotToLambdaProps, IotToLambda } from '@aws-solutions-constructs/aws-iot-lambda';

export function ApiStack({ app, stack }: StackContext) {
  const { rdsCluster } = use(RDSStack);
  const { cognito } = use(CognitoStack);
  const { cryptoLayer, luxonLayer, sharpLayer, expoServerSdk } = use(LambdaStack);

  // TimescaleDB Secret Keys
  const TIMESCALE_HOST = new Config.Secret(stack, "TIMESCALE_HOST");
  const TIMESCALE_USER = new Config.Secret(stack, "TIMESCALE_USER");
  const TIMESCALE_PASSWORD = new Config.Secret(stack, "TIMESCALE_PASSWORD");
  const TIMESCALE_PORT = new Config.Secret(stack, "TIMESCALE_PORT");
  const TIMESCALE_DATABASE = new Config.Secret(stack, "TIMESCALE_DATABASE");

  // IoT publish lambda function
  const IOT_ENDPOINT = new Config.Secret(stack, "IOT_ENDPOINT");

  // Secret Keys
  const SECRET_KEY = new Config.Secret(stack, "SECRET_KEY");

  // Expo Server Access Token for Push
  const EXPO_ACCESS_TOKEN = new Config.Secret(stack, "EXPO_ACCESS_TOKEN");

  // lambda functions timeout
  const timeout = app.stage == "prod" ? "10 seconds" : "30 seconds";

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

  // IoT Functions
  const publishFunction = new Function(stack, "iot_publish", {
    handler: "packages/functions/src/events/publish_event.main",
    timeout,
    bind: [IOT_ENDPOINT],
    // @ts-expect-error ignore check
    role: iotRole
  });

  // Event Bus
  const eventBus = new EventBus(stack, "ChargebotEventBus", {
    rules: {
      outlet_schedule: {
        pattern: {
          source: ["created", "updated", "deleted"],
          detailType: ["outlet_schedule"],
        },
        targets: {
          publish_outlet_schedule: publishFunction,
        },
      },
      bot_created: {
        pattern: {
          source: ["created"],
          detailType: ["bot"],
        },
        targets: {
          on_bot_created: {
            function: {
              handler: "packages/functions/src/events/on_bot_created.main",
              timeout,
              bind: [rdsCluster],
            }
          },
        },
      }
    },
  });

  // S3 Bucket
  const bucket = new Bucket(stack, "UserData");
  // Allow the notification functions to access the bucket
  bucket.attachPermissions([bucket]);

  // Create an IAM role
  const iamRole: IRole = new Role(stack, "ApiRole", {
    assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    managedPolicies: [
      { managedPolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" },
    ],
  });

  // Create the HTTP API
  const api = new Api(stack, "Api", {
    // customDomain: {
    //   path: "v1",
    // },
    accessLog: {
      retention: "one_month",
      format: "$context.identity.sourceIp,$context.requestTime,$context.httpMethod,$context.routeKey,$context.protocol,$context.status,$context.responseLength,$context.requestId"
    },
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: cognito.userPoolId,
          clientIds: [cognito.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: "jwt",
      //authorizationScopes: ["user.id", "user.email"],
      throttle: {
        /*
        * When request submissions exceed the steady-state request rate and burst limits,
        * API Gateway begins to throttle requests.
        * Clients may receive 429 Too Many Requests error responses at this point.
        * Upon catching such exceptions, the client can resubmit the failed requests in a way that is rate limiting.
        */
        rate: 2000,
        burst: 100,
      },
      function: {
        timeout,
        bind: [
          rdsCluster,
          eventBus,
          TIMESCALE_HOST,
          TIMESCALE_USER,
          TIMESCALE_PASSWORD,
          TIMESCALE_PORT,
          TIMESCALE_DATABASE,
          SECRET_KEY,
        ],
        // @ts-expect-error ignore error
        role: iamRole
      },
      layers: [luxonLayer, cryptoLayer],
      nodejs: {
        install: ["luxon", "crypto-es"],
      },
    },
    cors: {
      allowMethods: ["ANY"],
      allowOrigins: ["*"],
    },
    routes: {
      "GET /{entity}": "packages/functions/src/crud/list.main",
      "GET /{entity}/{id}": "packages/functions/src/crud/get.main",
      "POST /{entity}": "packages/functions/src/crud/create.main",
      "POST /{entity}/search": "packages/functions/src/crud/search.main",
      "PATCH /{entity}/{id}": "packages/functions/src/crud/update.main",
      "DELETE /{entity}/{id}": "packages/functions/src/crud/remove.main",
      "GET /bot/assigned": "packages/functions/src/api/bots_assigned.main",
      "GET /bot/{bot_uuid}/location": "packages/functions/src/api/bot_location.main",
      "GET /bot/{bot_uuid}/status": {
        function: {
          handler: "packages/functions/src/api/bot_status.main",
          bind: [IOT_ENDPOINT],
          // @ts-expect-error ignore type error
          role: iotRole,
        }
      },
      "GET /bot/{bot_uuid}/status/encrypted": {
        function: {
          handler: "packages/functions/src/api/bot_status_encrypted.main",
          bind: [IOT_ENDPOINT],
          // @ts-expect-error ignore type error
          role: iotRole,
        }
      },
      "GET /bot/{id}/outlets": "packages/functions/src/api/bot_outlets.main",
      "GET /bot/{bot_uuid}/outlet/{outlet_id}": "packages/functions/src/api/bot_outlet_details.main",
      "GET /bot/{bot_uuid}/location/from/{from}/to/{to}": "packages/functions/src/api/bot_location_history.main",
      "GET /bot/{bot_uuid}/location/days_info/from/{from}/to/{to}": "packages/functions/src/api/bot_location_days_info.main",
      "GET /bot/{bot_uuid}/usage/totals": "packages/functions/src/api/bot_usage_totals.main",
      "GET /bot/{bot_uuid}/usage/day/{date}": "packages/functions/src/api/bot_usage_history.main",
      "GET /bot/{bot_uuid}/usage/days_info/from/{from}/to/{to}": "packages/functions/src/api/bot_usage_days_info.main",
      "GET /bot/{bot_uuid}/usage/interval/from/{from}/to/{to}": "packages/functions/src/api/bot_usage_interval.main",
      "GET /equipment/customer/{customer_id}": "packages/functions/src/api/equipments_by_customer.main",
      "POST /equipment/{equipment_id}/outlet/{outlet_id}": "packages/functions/src/api/assign_equipment_outlet.main",
      "DELETE /equipment/{equipment_id}/outlet/{outlet_id}": "packages/functions/src/api/unassign_equipment_outlet.main",
      "POST /bot/{bot_uuid}/control": {
        function: {
          handler: "packages/functions/src/api/control_outlet.main",
          bind: [IOT_ENDPOINT],
          // @ts-expect-error ignore type error
          role: iotRole
        }
      },
      "POST /bot/{bot_uuid}/control/encrypted": {
        function: {
          handler: "packages/functions/src/api/control_outlet_encrypted.main",
          bind: [IOT_ENDPOINT],
          // @ts-expect-error ignore type error
          role: iotRole
        }
      },
      "GET /user/{cognito_id}/profile": {
        function: {
          handler: "packages/functions/src/api/get_user_profile.main",
          bind: [bucket]
        }
      },
      "PATCH /user/{cognito_id}/profile": "packages/functions/src/api/update_user_profile.main",
      "PUT /user/{cognito_id}/photo": {
        function: {
          handler: "packages/functions/src/api/upload_user_photo.main",

          // @ts-expect-error ignore type errors
          layers: [sharpLayer],
          nodejs: {
            install: ["sharp"],
          },
          bind: [bucket],
        },
      },
      "POST /user/{cognito_id}/register_app_install": "packages/functions/src/api/register_app_install.main"
    }
  });

  // Lambda function to execute when messages arrive to 'chargebot/alert' IoT topic
  const processIotAlertsFunction = new Function(stack, "process_iot_chargebot_alert", {
    handler: "packages/functions/src/api/send_push_alert.main",
    timeout,
    // @ts-expect-error ignore type errors
    layers: [expoServerSdk],
    nodejs: {
      install: ["expo-server-sdk"],
    },
    bind: [EXPO_ACCESS_TOKEN],
  });

  let logGroup = LogGroup.fromLogGroupName(stack, `ChargebotIoTAlertLogGroup_${app.stage}`, `ChargebotIoTAlertLogGroup_${app.stage}`);
  if (!logGroup) {
    logGroup = new LogGroup(stack, `ChargebotIoTAlertLogGroup_${app.stage}`,{
      logGroupName: `ChargebotIoTAlertLogGroup_${app.stage}`,
      retention: RetentionDays.ONE_MONTH
    });
  }

  let errorLogGroup = LogGroup.fromLogGroupName(stack, `ChargebotIoTAlertErrorLogGroup_${app.stage}`, `ChargebotIoTAlertErrorLogGroup_${app.stage}`);
  if (!errorLogGroup) {
    errorLogGroup = new LogGroup(stack, `ChargebotIoTAlertErrorLogGroup_${app.stage}`,{
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

  // allowing authenticated users to access API
  cognito.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    ApiDomainUrl: api.customDomainUrl,
    BucketName: bucket.bucketName
  });
}
