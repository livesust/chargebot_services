import { StackContext, Cognito } from "sst/constructs";
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

    stack.addOutputs({
        CognitoUserPoolId: cognito.userPoolId,
        CognitoIdentityPoolId: cognito.cognitoIdentityPoolId,
        CognitoUserPoolClientId: cognito.userPoolClientId
    });

    return {
        cognito,
    };
}
