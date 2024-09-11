import { StackContext, Config, Cognito, toCdkDuration, use, Cron, Function } from "sst/constructs";
import { RDSStack } from "./RDSStack";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
// import * as ses from "aws-cdk-lib/aws-ses";

export function CognitoStack({ app, stack }: StackContext) {

    // Secret Keys
    const COGNITO_USER_POOL_ID = new Config.Secret(stack, "COGNITO_USER_POOL_ID");

    // // SES Verified Domain ARN (replace with your domain)
    // const sesVerifiedDomainArn = `arn:aws:ses:${app.region}:${app.account}:identity/no-reply@sust.pro`;

    // Cognito admin role
    const cognitoAdminRole: iam.IRole = new iam.Role(stack, "CognitoAdminRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        { managedPolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" },
      ],
    });
    const policy: iam.Policy = new iam.Policy(stack, "CognitoAdminRolePolicy", {
      policyName: 'lambda_iot_policy',
      statements: [new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminDeleteUser",
          "cognito-idp:AdminGetUser",
          "cognito-idp:AdminDisableUser",
          "cognito-idp:AdminEnableUser",
          "cognito-idp:AdminResetUserPassword",
        ],
        resources: ["*"]
      })]
    });
    policy.attachToRole(cognitoAdminRole);

    // Cognito user pool authentication
    // @ts-expect-error ignore type errors
    const fsExtraLayer = new lambda.LayerVersion(stack, "fsExtra-layer", {
      code: lambda.Code.fromAsset("layers/fs-extra"),
    });

    const cognitoCustomMessageFunction = new Function(stack, "cognitoCustomMessageFunction", {
      handler: "packages/functions/src/api/cognito_custom_message_handler.main",
      timeout: app.stage === "prod" ? "10 seconds" : "30 seconds",
      copyFiles: [{ from: 'packages/functions/src/shared/templates', to: 'templates'}],
      // @ts-expect-error ignore type errors
      layers: [fsExtraLayer],
      nodejs: {
        install: ["fs-extra"],
      },
      environment: {
        AUTH_SIGN_IN_URL: app.stage === "dev" ? "http://localhost:3000/auth/cognito/sign-in" : "https://chargebot-web-app.vercel.app/auth/cognito/sign-in"
      }
    });

    const cognitoConfig = new Cognito(stack, "Auth", {
        login: ["email"],
        triggers: {
          customMessage: cognitoCustomMessageFunction
        },
        cdk: {
            userPool: {
                selfSignUpEnabled: app.stage !== "prod",
                autoVerify: {
                    email: true
                },
                accountRecovery: cognito.AccountRecovery.PHONE_WITHOUT_MFA_AND_EMAIL,
                userVerification: {
                    emailSubject: "Verify your new Sust Pro account"
                },
                standardAttributes: {
                    locale: { required: false, mutable: true },
                    givenName: { required: false, mutable: true },
                    familyName: { required: false, mutable: true },
                    profilePicture: { required: false, mutable: true }
                },
                customAttributes: {
                    customerId: new cognito.NumberAttribute({ mutable: false })
                },
                passwordPolicy: {
                  minLength: 8,
                  requireDigits: false,
                  requireLowercase: false,
                  requireUppercase: false,
                  requireSymbols: false,
                  tempPasswordValidity: toCdkDuration('30 day')
                },
            },
            userPoolClient: {
                authFlows: {
                    adminUserPassword: true,
                    userPassword: true,
                    userSrp: true,
                    custom: true
                },
                oAuth: {
                    flows: {
                        authorizationCodeGrant: true
                    },
                    callbackUrls: app.stage === "prod"
                      ? ["https://chargebot-web-app.vercel.app"]
                      : (
                        app.stage === "dev"
                        ? ["http://localhost:3000"]
                        : ["https://chargebot-web-app.vercel.app"]
                        ),
                    logoutUrls: app.stage === "prod"
                      ? ["https://chargebot-web-app.vercel.app/auth/cognito/sign-in"]
                      : (
                        app.stage === "dev"
                        ? ["http://localhost:3000/auth/cognito/sign-in"]
                        : ["https://chargebot-web-app.vercel.app/cognito/sign-in"]
                        ),
                    scopes: [cognito.OAuthScope.EMAIL]
                },
                preventUserExistenceErrors: true,
                enableTokenRevocation: true,
                refreshTokenValidity: toCdkDuration('180 days'),
            }
        }
    });

    if (app.stage === "prod") {
      cognitoConfig.cdk.userPool.addDomain("chargebot", { cognitoDomain: { domainPrefix: "chargebot" } })
    } else if (app.stage === "staging") {
      cognitoConfig.cdk.userPool.addDomain("chargebotstaging", { cognitoDomain: { domainPrefix: "chargebotstaging" } })
    } else if (app.stage === "dev") {
      cognitoConfig.cdk.userPool.addDomain("chargebotdev", { cognitoDomain: { domainPrefix: "chargebotdev" } })
    }

    cognitoConfig.attachPermissionsForAuthUsers(stack, ["ssm"])

    // Cron function to expire user invitations
    const { rdsCluster } = use(RDSStack);
    new Cron(stack, "ExpireUserInvitationsCron", {
      schedule: app.stage === "dev" ? "rate(60 minutes)" : "rate(1 day)",
      job: {
        function: {
          handler: "packages/functions/src/api/expire_user_invitation.main",
          timeout: app.stage === "prod" ? "10 seconds" : "30 seconds",
          bind: [rdsCluster, COGNITO_USER_POOL_ID],
          // @ts-expect-error ignore check
          role: cognitoAdminRole,
        }
      },
    });

    stack.addOutputs({
        CognitoUserPoolId: cognitoConfig.userPoolId,
        CognitoIdentityPoolId: cognitoConfig.cognitoIdentityPoolId,
        CognitoUserPoolClientId: cognitoConfig.userPoolClientId,
    });

    return {
        cognito: cognitoConfig,
        cognitoAdminRole,
        COGNITO_USER_POOL_ID
    };
}
