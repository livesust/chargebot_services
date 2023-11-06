import { StackContext, Api, RDS, Cognito } from "sst/constructs";
import { AccountRecovery, NumberAttribute, OAuthScope } from "aws-cdk-lib/aws-cognito";
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
                autoVerify: {
                    email: true
                },
                accountRecovery: AccountRecovery.PHONE_WITHOUT_MFA_AND_EMAIL,
                userVerification: {
                    emailSubject: "Verify your new Sust Pro account"
                },
                userInvitation: {
                    emailSubject: "Your temporary Sust Pro password"
                },
                standardAttributes: {
                    locale: { required: false, mutable: true },
                    givenName: { required: false, mutable: true },
                    familyName: { required: false, mutable: true },
                    profilePicture: { required: false, mutable: true }
                },
                customAttributes: {
                    customerId: new NumberAttribute({ mutable: false })
                },
            },
            userPoolClient: {
                authFlows: {
                    adminUserPassword: true,
                    userPassword: true,
                    userSrp: true
                },
                oAuth: {
                    flows: {
                        authorizationCodeGrant: true
                    },
                    callbackUrls: ["https://chargebot.sust.pro"],
                    logoutUrls: ["https://chargebot.sust.pro/login"],
                    scopes: [OAuthScope.EMAIL]
                },
                preventUserExistenceErrors: true,
                enableTokenRevocation: true,
            }
        }
    });
    cognito.cdk.userPool.addDomain("chargebot", { cognitoDomain: { domainPrefix: "chargebot" } })

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
                bind: [cluster],
            },
        },
        // @ts-ignore
        routes: routes,
    });

    // allowing authenticated users to access API
    cognito.attachPermissionsForAuthUsers(stack, [api]);

    stack.addOutputs({
        ApiEndpoint: api.url,
        ApiDomainUrl: api.customDomainUrl,
        CognitoUserPoolId: cognito.userPoolId,
        CognitoIdentityPoolId: cognito.cognitoIdentityPoolId,
        CognitoUserPoolClientId: cognito.userPoolClientId,
        RDSSecretArn: cluster.secretArn,
        RDSClusterEndpoint: JSON.stringify(cluster.clusterEndpoint),
        RDSClusterIdentifier: cluster.clusterIdentifier,
    });
}
