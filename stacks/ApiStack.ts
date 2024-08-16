import { StackContext, Config, Api, Bucket, use } from "sst/constructs";
import { TimescaleStack } from "./TimescaleStack";
import { RDSStack } from "./RDSStack";
import { CognitoStack } from "./CognitoStack";
import { LambdaStack } from "./LambdaStack";
import { IotStack } from "./IotStack";

import { IRole, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

import { EventBusStack } from "./EventBusStack";

export function ApiStack({ app, stack }: StackContext) {
  const { rdsCluster } = use(RDSStack);
  const { timescaleConfigs } = use(TimescaleStack);
  const { eventBus } = use(EventBusStack);
  const { cognito, cognitoAdminRole, COGNITO_USER_POOL_ID } = use(CognitoStack);
  const { iotRole, IOT_ENDPOINT } = use(IotStack);
  const { lambdaLayers, functions, setupProvisionedConcurrency } = use(LambdaStack);

  // Secret Keys
  const SECRET_KEY = new Config.Secret(stack, "SECRET_KEY");

  // lambda functions timeout
  const timeout = app.stage === "prod" ? "10 seconds" : "30 seconds";

  // S3 Bucket
  const bucket = new Bucket(stack, "userProfile");

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
        * 
        * https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html
        */
        rate: 2000,
        burst: 100,
      },
      function: {
        timeout,
        bind: [
          rdsCluster,
          timescaleConfigs.TIMESCALE_HOST,
          timescaleConfigs.TIMESCALE_USER,
          timescaleConfigs.TIMESCALE_PASSWORD,
          timescaleConfigs.TIMESCALE_PORT,
          timescaleConfigs.TIMESCALE_DATABASE,
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
      "GET /{entity}/page/{page}/pageSize/{pageSize}": {
        function: {
          handler: "packages/functions/src/crud/paginate.main",
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
      "GET /bot/{bot_uuid}/status": { 
        function: {
          handler: "packages/functions/src/api/bot_status.main",
          timeout,
          // @ts-expect-error ignore check
          role: iotRole,
          bind: [IOT_ENDPOINT]
        }
      },
      "GET /bot/{bot_uuid}/status/encrypted": {
        function: {
          handler: "packages/functions/src/api/bot_status_encrypted.main",
          timeout,
          // @ts-expect-error ignore check
          role: iotRole,
          bind: [IOT_ENDPOINT],
        }
      },
      "GET /bot/{bot_uuid}/outlets": "packages/functions/src/api/bot_outlets.main",
      "GET /bot/{bot_uuid}/errors": {
        function: {
          handler: "packages/functions/src/api/bot_errors.main",
          // @ts-expect-error ignore type errors
          layers: [lambdaLayers.i18nLayer],
          nodejs: {
            install: ["i18n"],
          },
        }
      },
      "GET /bot/{bot_uuid}/warning_alerts": {
        function: {
          handler: "packages/functions/src/api/bot_warning_alerts.main",
          // @ts-expect-error ignore type errors
          layers: [lambdaLayers.i18nLayer],
          nodejs: {
            install: ["i18n"],
          },
        }
      },
      "GET /bot/{bot_uuid}/outlet/{outlet_id}": "packages/functions/src/api/bot_outlet_details.main",
      "GET /bot/{bot_uuid}/location/from/{from}/to/{to}": "packages/functions/src/api/bot_location_history.main",
      "GET /bot/{bot_uuid}/location/days_info/from/{from}/to/{to}": "packages/functions/src/api/bot_location_days_info.main",
      "GET /bot/{bot_uuid}/usage/totals": "packages/functions/src/api/bot_usage_totals.main",
      "GET /bot/{bot_uuid}/usage/day/{date}": "packages/functions/src/api/bot_usage_by_day.main",
      "GET /bot/{bot_uuid}/usage/days_info/from/{from}/to/{to}": "packages/functions/src/api/bot_usage_days_info.main",
      "GET /bot/{bot_uuid}/usage/interval/from/{from}/to/{to}": "packages/functions/src/api/bot_usage_days_history.main",
      "POST /bot/{bot_id}/company/{company_id}": "packages/functions/src/api/assign_bot_company.main",
      "GET /equipment/customer/{customer_id}": "packages/functions/src/api/equipments_by_customer.main",
      "POST /equipment/{equipment_id}/outlet/{outlet_id}": "packages/functions/src/api/assign_equipment_outlet.main",
      "DELETE /equipment/{equipment_id}/outlet/{outlet_id}": "packages/functions/src/api/unassign_equipment_outlet.main",
      "POST /bot/{bot_uuid}/control": {
        function: {
          handler: "packages/functions/src/api/control_outlet.main",
          timeout,
          // @ts-expect-error ignore check
          role: iotRole,
          bind: [IOT_ENDPOINT],
        }
      },
      "POST /bot/{bot_uuid}/control/encrypted": {
        function: {
          handler: "packages/functions/src/api/control_outlet_encrypted.main",
          timeout,
          // @ts-expect-error ignore check
          role: iotRole,
          bind: [IOT_ENDPOINT],
        }
      },
      "GET /bot/{bot_uuid}/configs": { 
        function: {
          handler: "packages/functions/src/api/bot_get_shadow_configs.main",
          timeout,
          // @ts-expect-error ignore check
          role: iotRole,
          bind: [IOT_ENDPOINT]
        }
      },
      "POST /bot/{bot_uuid}/configs": { 
        function: {
          handler: "packages/functions/src/api/bot_set_shadow_configs.main",
          timeout,
          // @ts-expect-error ignore check
          role: iotRole,
          bind: [IOT_ENDPOINT]
        }
      },
      "GET /user/{cognito_id}/profile": {
        function: {
          handler: "packages/functions/src/api/get_user_profile.main",
          bind: [bucket]
        }
      },
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
      "POST /user/{cognito_id}/register_app_install": "packages/functions/src/api/register_app_install.main",
      "GET /company/{company_id}/home_master": "packages/functions/src/api/get_company_home_master.main",
      "POST /company/{company_id}/home_master": "packages/functions/src/api/post_company_home_master.main",
      "GET /company/{company_id}/bots": "packages/functions/src/api/get_company_bots.main",
      "POST /user/invite": {
        function: {
          handler: "packages/functions/src/api/invite_user.main",
          // @ts-expect-error ignore check
          role: cognitoAdminRole,
          bind: [COGNITO_USER_POOL_ID],
        },
      },
      "PATCH /user/{cognito_id}/profile": "packages/functions/src/api/update_user_profile.main",
      "POST /user/reinvite": {
        function: {
          handler: "packages/functions/src/api/reinvite_user.main",
          // @ts-expect-error ignore check
          role: cognitoAdminRole,
          bind: [COGNITO_USER_POOL_ID],
        },
      },
      "POST /user/expire_invitations": {
        function: {
          handler: "packages/functions/src/api/expire_user_invitation.main",
          // @ts-expect-error ignore check
          role: cognitoAdminRole,
          bind: [COGNITO_USER_POOL_ID],
        },
      },
      "PATCH /user/{cognito_id}/inactivate": {
        function: {
          handler: "packages/functions/src/api/inactivate_user.main",
          // @ts-expect-error ignore check
          role: cognitoAdminRole,
          bind: [COGNITO_USER_POOL_ID],
        },
      },
      "PATCH /user/{cognito_id}/activate": {
        function: {
          handler: "packages/functions/src/api/activate_user.main",
          // @ts-expect-error ignore check
          role: cognitoAdminRole,
          bind: [COGNITO_USER_POOL_ID],
        },
      },
      "POST /send-alert": {
        cdk: {
          function: functions.processIotAlertsFunction,
        }
      },
      // UNCOMMENT JUST FOR TESTING IN DEV MODE
      // IN OTHER CASE THE Throttling will cause errors when processing from Kafka
      // "POST /test-gps-geocoding": {
      //   cdk: {
      //     function: functions.processIotGpsParkedFunction,
      //   }
      // }
    }
  });

  // setupProvisionedConcurrency(stack, api.getFunction("GET /bot/assigned"));
  // setupProvisionedConcurrency(stack, api.getFunction("GET /bot/{bot_uuid}/status"));

  // allowing authenticated users to access API
  cognito.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    ApiDomainUrl: api.customDomainUrl,
    BucketName: bucket.bucketName,
    GpsParkedLambdaArn: functions.processIotGpsParkedFunction.functionArn,
  });
}
