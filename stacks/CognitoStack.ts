import { StackContext, Cognito, toCdkDuration } from "sst/constructs";
import { AccountRecovery, NumberAttribute, OAuthScope } from "aws-cdk-lib/aws-cognito";
import { Effect, IRole, Policy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export function CognitoStack({ app, stack }: StackContext) {

    // Cognito admin role
    const cognitoAdminRole: IRole = new Role(stack, "CognitoAdminRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    const policy: Policy = new Policy(stack, "CognitoAdminRolePolicy", {
      policyName: 'lambda_iot_policy',
      statements: [new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "cognito-idp:AdminCreateUser",
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
                        Your username is {username} and temporary password is {####}\
                        <br>\
                        Click <a href='https://chargebot.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=4gbeo5gpg3dso0m1vplllmaq0u&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fchargebot.sust.pro'>here</a> to log in.\
                      "
                    : (
                      app.stage === "dev"
                      ? "\
                          Your username is {username} and temporary password is {####}\
                          <br>\
                          Click <a href='https://chargebotdev.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=3qebfgou0c3k77q0j5ck8pei7e&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fchargebotdev.sust.pro'>here</a> to log in.\
                        "
                      : "\
                          Your username is {username} and temporary password is {####}\
                          <br>\
                          Click <a href='https://chargebotstaging.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=4gbeo5gpg3dso0m1vplllmaq0u&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fchargebotstaging.sust.pro'>here</a> to log in.\
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
                  requireSymbols: false
                }
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
                      ? ["https://chargebot.sust.pro"]
                      : (
                        app.stage === "dev"
                        ? ["https://chargebotdev.sust.pro"]
                        : ["https://chargebotstaging.sust.pro"]
                        ),
                    logoutUrls: app.stage === "prod"
                      ? ["https://chargebot.sust.pro/login"]
                      : (
                        app.stage === "dev"
                        ? ["https://chargebotdev.sust.pro/login"]
                        : ["https://chargebotstaging.sust.pro/login"]
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

    stack.addOutputs({
        CognitoUserPoolId: cognito.userPoolId,
        CognitoIdentityPoolId: cognito.cognitoIdentityPoolId,
        CognitoUserPoolClientId: cognito.userPoolClientId
    });

    return {
        cognito,
        cognitoAdminRole
    };
}
