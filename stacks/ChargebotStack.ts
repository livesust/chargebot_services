import { StackContext, Api, RDS, Cognito } from "sst/constructs";
import { StringAttribute } from "aws-cdk-lib/aws-cognito";
import routes from './routes';

export function ChargebotStack({ app, stack }: StackContext) {

  // Create the Aurora DB cluster
  const DATABASE = "chargebot";

  const cluster = new RDS(stack, "RDSCluster", {
    engine: "postgresql13.9",
    defaultDatabaseName: DATABASE,
    migrations: "services/migrations",
    types: {
      path: "backend/core/sql/types.ts",
      camelCase: true
    },
    scaling: app.stage === "prod"
      ? {
        autoPause: false,
        minCapacity: 'ACU_8',
        maxCapacity: 'ACU_64',
      }
      : {
        autoPause: true,
        minCapacity: 'ACU_2',
        maxCapacity: 'ACU_2',
      },
  });

  // Cognito user pool authentication
  const cognito = new Cognito(stack, "Auth", {
    login: ["email"],
    cdk: {
      userPool: {
        selfSignUpEnabled: app.stage !== "prod",
        userVerification: {
          emailSubject: "Verify your new Sust Pro account"
        },
        userInvitation: {
          emailSubject: "Your temporary Sust Pro password"
        },
        standardAttributes: {
          locale: { required: true, mutable: true },
          givenName: { required: true, mutable: true },
          familyName: { required: true, mutable: true },
          profilePicture: { required: false, mutable: true }
        },
        customAttributes: {
          companyId: new StringAttribute({ minLen: 5, maxLen: 15, mutable: false })
        },
      }
    }
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
      userPoolAuthorizer: {
        type: "user_pool",
        userPool: {
          id: cognito.userPoolId,
          clientIds: [cognito.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: "userPoolAuthorizer",
      authorizationScopes: ["user.id", "user.email"],
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
        bind: [cluster],
      },
    },
    routes: routes,
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    ApiDomainUrl: api.customDomainUrl,
    CognitoUserPool: cognito.userPoolId,
    RDSSecretArn: cluster.secretArn,
    RDSClusterEndpoint: JSON.stringify(cluster.clusterEndpoint),
    RDSClusterIdentifier: cluster.clusterIdentifier,
  });
}
