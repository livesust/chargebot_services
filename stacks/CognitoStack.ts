import { StackContext, Config, Cognito, toCdkDuration, use, Cron } from "sst/constructs";
import { AccountRecovery, NumberAttribute, OAuthScope } from "aws-cdk-lib/aws-cognito";
import { Effect, IRole, Policy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { RDSStack } from "./RDSStack";

export function CognitoStack({ app, stack }: StackContext) {

    // Secret Keys
    const COGNITO_USER_POOL_ID = new Config.Secret(stack, "COGNITO_USER_POOL_ID");

    // Cognito admin role
    const cognitoAdminRole: IRole = new Role(stack, "CognitoAdminRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        { managedPolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" },
      ],
    });
    const policy: Policy = new Policy(stack, "CognitoAdminRolePolicy", {
      policyName: 'lambda_iot_policy',
      statements: [new PolicyStatement({
        effect: Effect.ALLOW,
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
                    emailSubject: "Your temporary Sust Pro password",
                    emailBody: app.stage === "prod"
                    ? "\
                        Your username is {username} and temporary password is <b>{####}</b>\
                        <br>\
                        Click <a href='https://chargebot-web-app.vercel.app/auth/cognito/sign-in'>here</a> to log in.\
                      "
                    : (
                      app.stage === "dev"
                      ? "\
                          Your username is {username} and temporary password is <b>{####}</b>\
                          <br>\
                          Click <a href='http://localhost:3000/auth/cognito/sign-in'>here</a> to log in.\
                        "
                      : "\
                          Your username is {username} and temporary password is <b>{####}</b>\
                          <br>\
                          Click <a href='https://chargebot-web-app.vercel.app/auth/cognito/sign-in'>here</a> to log in.\
                        "
                      ),
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
                    scopes: [OAuthScope.EMAIL]
                },
                preventUserExistenceErrors: true,
                enableTokenRevocation: true,
                refreshTokenValidity: toCdkDuration('180 days'),
            }
        }
    });

    if (app.stage === "prod") {
      cognito.cdk.userPool.addDomain("chargebot", { cognitoDomain: { domainPrefix: "chargebot" } })
    } else if (app.stage === "staging") {
      cognito.cdk.userPool.addDomain("chargebotstaging", { cognitoDomain: { domainPrefix: "chargebotstaging" } })
    } else if (app.stage === "dev") {
      cognito.cdk.userPool.addDomain("chargebotdev", { cognitoDomain: { domainPrefix: "chargebotdev" } })
    }

    cognito.attachPermissionsForAuthUsers(stack, ["ssm"])

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
        CognitoUserPoolId: cognito.userPoolId,
        CognitoIdentityPoolId: cognito.cognitoIdentityPoolId,
        CognitoUserPoolClientId: cognito.userPoolClientId,
    });

    return {
        cognito,
        cognitoAdminRole,
        COGNITO_USER_POOL_ID
    };
}
