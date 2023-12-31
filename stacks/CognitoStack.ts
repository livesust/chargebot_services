import { StackContext, Cognito, toCdkDuration } from "sst/constructs";
import { AccountRecovery, NumberAttribute, OAuthScope } from "aws-cdk-lib/aws-cognito";

export function CognitoStack({ app, stack }: StackContext) {

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
                    userSrp: true,
                    custom: true
                },
                oAuth: {
                    flows: {
                        authorizationCodeGrant: true
                    },
                    callbackUrls: app.stage == "prod"
                      ? ["https://chargebot.sust.pro"]
                      : (
                        app.stage == "dev"
                        ? ["https://chargebotdev.sust.pro"]
                        : ["https://chargebotstaging.sust.pro"]
                        ),
                    logoutUrls: app.stage == "prod"
                      ? ["https://chargebot.sust.pro/login"]
                      : (
                        app.stage == "dev"
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
    if (app.stage == "prod") {
      cognito.cdk.userPool.addDomain("chargebot", { cognitoDomain: { domainPrefix: "chargebot" } })
    } else if (app.stage == "staging") {
      cognito.cdk.userPool.addDomain("chargebotstaging", { cognitoDomain: { domainPrefix: "chargebotstaging" } })
    } else if (app.stage == "dev") {
      cognito.cdk.userPool.addDomain("chargebotdev", { cognitoDomain: { domainPrefix: "chargebotdev" } })
    }

    stack.addOutputs({
        CognitoUserPoolId: cognito.userPoolId,
        CognitoIdentityPoolId: cognito.cognitoIdentityPoolId,
        CognitoUserPoolClientId: cognito.userPoolClientId
    });

    return {
        cognito,
    };
}
