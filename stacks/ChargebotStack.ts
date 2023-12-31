import { StackContext, Config, Api, use } from "sst/constructs";
import { RDSStack } from "./RDSStack";
import { CognitoStack } from "./CognitoStack";
import { Effect, IRole, Policy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { LayerVersion, Code } from "aws-cdk-lib/aws-lambda";

export function ChargebotStack({ stack }: StackContext) {
  const { rdsCluster } = use(RDSStack);
  const { cognito } = use(CognitoStack);

  // TimescaleDB Secret Keys
  const TIMESCALE_HOST = new Config.Secret(stack, "TIMESCALE_HOST");
  const TIMESCALE_USER = new Config.Secret(stack, "TIMESCALE_USER");
  const TIMESCALE_PASSWORD = new Config.Secret(stack, "TIMESCALE_PASSWORD");
  const TIMESCALE_PORT = new Config.Secret(stack, "TIMESCALE_PORT");
  const TIMESCALE_DATABASE = new Config.Secret(stack, "TIMESCALE_DATABASE");

  // IoT Keys
  const IOT_API_URL = new Config.Secret(stack, "IOT_API_URL");
  const IOT_API_KEY = new Config.Secret(stack, "IOT_API_KEY");
  const IOT_ENDPOINT = new Config.Secret(stack, "IOT_ENDPOINT");

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

  // axios lambda layer to make http requests
  const axiosLayer = new LayerVersion(stack, "axios-layer", {
    code: Code.fromAsset("layers/axios"),
  });


  const luxonLayer = new LayerVersion(stack, "luxon-layer", {
    code: Code.fromAsset("layers/luxon"),
  });

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
        bind: [
          rdsCluster,
          TIMESCALE_HOST,
          TIMESCALE_USER,
          TIMESCALE_PASSWORD,
          TIMESCALE_PORT,
          TIMESCALE_DATABASE,
        ],
        // @ts-expect-error ignore error
        role: iamRole
      },
      layers: [luxonLayer],
      nodejs: {
        install: ["luxon"],
      },
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
          // @ts-expect-error ignore type errors
          layers: [axiosLayer],
          nodejs: {
            install: ["axios"],
          },
          bind: [
            IOT_API_URL,
            IOT_API_KEY
          ],
        }
      },
      "GET /bot/{id}/outlets": "packages/functions/src/api/bot_outlets.main",
      "GET /bot/{bot_uuid}/outlet/{outlet_id}": "packages/functions/src/api/bot_outlet_details.main",
      "GET /bot/{bot_uuid}/location/from/{from}/to/{to}": "packages/functions/src/api/bot_location_history.main",
      "GET /bot/{bot_uuid}/usage/totals": "packages/functions/src/api/bot_usage_totals.main",
      "GET /bot/{bot_uuid}/usage/day/{date}": "packages/functions/src/api/bot_usage_history.main",
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
    }
  });

  // allowing authenticated users to access API
  cognito.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    ApiDomainUrl: api.customDomainUrl
  });
}
