import { StackContext, Config, Api, Bucket, use } from "sst/constructs";
import { RDSStack } from "./RDSStack";
import { CognitoStack } from "./CognitoStack";
import { LambdaStack } from "./LambdaStack";

import { IRole, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

import { EventBusStack } from "./EventBusStack";

export function ApiStack({ app, stack }: StackContext) {
  const { rdsCluster } = use(RDSStack);
  const { eventBus } = use(EventBusStack);
  const { cognito } = use(CognitoStack);
  const { lambdaLayers, lambdaFunctions, setupProvisionedConcurrency } = use(LambdaStack);

  // TimescaleDB Secret Keys
  const TIMESCALE_HOST = new Config.Secret(stack, "TIMESCALE_HOST");
  const TIMESCALE_USER = new Config.Secret(stack, "TIMESCALE_USER");
  const TIMESCALE_PASSWORD = new Config.Secret(stack, "TIMESCALE_PASSWORD");
  const TIMESCALE_PORT = new Config.Secret(stack, "TIMESCALE_PORT");
  const TIMESCALE_DATABASE = new Config.Secret(stack, "TIMESCALE_DATABASE");

  // Secret Keys
  const SECRET_KEY = new Config.Secret(stack, "SECRET_KEY");

  // lambda functions timeout
  const timeout = app.stage === "prod" ? "10 seconds" : "30 seconds";

  // S3 Bucket
  const bucket = new Bucket(stack, "UserData");

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
      layers: [lambdaLayers.luxonLayer, lambdaLayers.cryptoLayer],
      nodejs: {
        install: ["luxon", "crypto-es"],
      },
    },
    cors: {
      allowMethods: ["ANY"],
      allowOrigins: ["*"],
    },
    routes: {
      "GET /{entity}": {
        function: {
          handler: "packages/functions/src/crud/list.main",
          bind: [eventBus]
        }
      },
      "GET /{entity}/{id}": {
        function: {
          handler: "packages/functions/src/crud/get.main",
          bind: [eventBus]
        }
      },
      "POST /{entity}": {
        function: {
          handler: "packages/functions/src/crud/create.main",
          bind: [eventBus]
        }
      },
      "POST /{entity}/search": {
        function: {
          handler: "packages/functions/src/crud/search.main",
          bind: [eventBus]
        }
      },
      "PATCH /{entity}/{id}": {
        function: {
          handler: "packages/functions/src/crud/update.main",
          bind: [eventBus]
        }
      },
      "DELETE /{entity}/{id}": {
        function: {
          handler: "packages/functions/src/crud/remove.main",
          bind: [eventBus]
        }
      },
      "GET /bot/assigned": "packages/functions/src/api/bots_assigned.main",
      "GET /bot/{bot_uuid}/location": "packages/functions/src/api/bot_location.main",
      // @ts-expect-error ignore check
      "GET /bot/{bot_uuid}/status": { function: lambdaFunctions.botStatus },
      // @ts-expect-error ignore check
      "GET /bot/{bot_uuid}/status/encrypted": { function: lambdaFunctions.botStatusEncrypted },
      "GET /bot/{bot_uuid}/outlets": "packages/functions/src/api/bot_outlets.main",
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
      // @ts-expect-error ignore check
      "POST /bot/{bot_uuid}/control": { function: lambdaFunctions.botControl },
      // @ts-expect-error ignore check
      "POST /bot/{bot_uuid}/control/encrypted": { function: lambdaFunctions.botControlEncrypted },
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
          layers: [lambdaLayers.sharpLayer],
          nodejs: {
            install: ["sharp"],
          },
          bind: [bucket],
        },
      },
      "POST /user/{cognito_id}/register_app_install": "packages/functions/src/api/register_app_install.main"
    }
  });

  // setupProvisionedConcurrency(stack, api.getFunction("GET /bot/assigned"));
  // setupProvisionedConcurrency(stack, api.getFunction("GET /bot/{bot_uuid}/status"));

  // allowing authenticated users to access API
  cognito.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    ApiDomainUrl: api.customDomainUrl,
    BucketName: bucket.bucketName
  });
}
