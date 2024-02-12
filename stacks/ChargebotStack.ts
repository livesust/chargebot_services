import { StackContext, Config, Api, EventBus, Bucket, use } from "sst/constructs";
import { RDSStack } from "./RDSStack";
import { CognitoStack } from "./CognitoStack";

import { Effect, IRole, Policy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { LayerVersion, Code } from "aws-cdk-lib/aws-lambda";

export function ChargebotStack({ app, stack }: StackContext) {
  const { rdsCluster } = use(RDSStack);
  const { cognito } = use(CognitoStack);

  // TimescaleDB Secret Keys
  const TIMESCALE_HOST = new Config.Secret(stack, "TIMESCALE_HOST");
  const TIMESCALE_USER = new Config.Secret(stack, "TIMESCALE_USER");
  const TIMESCALE_PASSWORD = new Config.Secret(stack, "TIMESCALE_PASSWORD");
  const TIMESCALE_PORT = new Config.Secret(stack, "TIMESCALE_PORT");
  const TIMESCALE_DATABASE = new Config.Secret(stack, "TIMESCALE_DATABASE");

  // IoT Keys
  const IOT_ENDPOINT = new Config.Secret(stack, "IOT_ENDPOINT");

  // Secret Keys
  const SECRET_KEY = new Config.Secret(stack, "SECRET_KEY");

  // Create an IAM role
  const iamRole: IRole = new Role(stack, "ApiRole", {
    assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    managedPolicies: [
      { managedPolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" },
    ],
  });

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

  // Event Bus
  const publishFunction = {
    function: {
      handler: "packages/functions/src/iot/publish_event.main",
      bind: [IOT_ENDPOINT],
      role: iotRole
    }
  };

  const eventBus = new EventBus(stack, "ChargebotEventBus", {
    rules: {
      created: {
        pattern: {
          source: ["created", "updated", "deleted"],
          detailType: ["outlet_schedule"],
        },
        targets: {
          // @ts-expect-error ignore typing
          publish_outlet_schedule: publishFunction,
        },
      },
    },
  });

  // S3 Bucket
  const bucket = new Bucket(stack, "userBucket");
  // Allow the notification functions to access the bucket
  bucket.attachPermissions([bucket]);

  // Create the HTTP API
  const api = new Api(stack, "Api", {
    // customDomain: {
    //   path: "v1",
    // },
    accessLog: {
      retention: "one_month",
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
        timeout: app.stage == "prod" ? "10 seconds" : "30 seconds",
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
          // @ts-expect-error ignore error
          role: iotRole,
        }
      },
      "GET /bot/{bot_uuid}/status/encrypted": {
        function: {
          handler: "packages/functions/src/api/bot_status_encrypted.main",
          bind: [IOT_ENDPOINT],
          // @ts-expect-error ignore error
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
          // @ts-expect-error ignore error
          role: iotRole
        }
      },
      "POST /bot/{bot_uuid}/control/encrypted": {
        function: {
          handler: "packages/functions/src/api/control_outlet_encrypted.main",
          bind: [IOT_ENDPOINT],
          // @ts-expect-error ignore error
          role: iotRole
        }
      },
      "GET /user/{user_id}/profile": {
        function: {
          handler: "packages/functions/src/api/get_user_profile.main",
          bind: [bucket]
        }
      },
      "PATCH /user/{user_id}/profile": "packages/functions/src/api/update_user_profile.main",
      "PUT /user/{user_id}/photo": {
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
    }
  });

  // allowing authenticated users to access API
  cognito.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    ApiDomainUrl: api.customDomainUrl,
    BucketName: bucket.bucketName,
  });
}
