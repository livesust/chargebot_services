import { Config, Cognito, toCdkDuration, use, Cron, Function } from "sst/constructs";
import { RDSStack } from "./RDSStack";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ses from "aws-cdk-lib/aws-ses";
import * as kms from "aws-cdk-lib/aws-kms";
const setupKms = (stack) => {
    const kmsKey = new kms.Key(stack, "CustomSenderKey", {
        enableKeyRotation: true,
        description: "KMS key for Cognito custom sender",
        alias: `${stack.stackName}-custom-sender`,
    });
    kmsKey.addToResourcePolicy(new iam.PolicyStatement({
        actions: [
            "kms:Encrypt",
            "kms:Decrypt",
            "kms:GenerateDataKey",
            "kms:DescribeKey",
            "kms:CreateGrant",
        ],
        principals: [new iam.ServicePrincipal("cognito-idp.amazonaws.com")],
        resources: ["*"],
    }));
    return kmsKey;
};
const setupCognitoStaging = (app, stack, baseUrl, signInUrl, cognitoCustomMessageFunction) => {
    const stagingCognito = new Cognito(stack, "Auth", {
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
                    callbackUrls: [baseUrl],
                    logoutUrls: [signInUrl],
                    scopes: [cognito.OAuthScope.EMAIL]
                },
                preventUserExistenceErrors: true,
                enableTokenRevocation: true,
                refreshTokenValidity: toCdkDuration('180 days'),
            }
        }
    });
    if (app.stage === "prod") {
        stagingCognito.cdk.userPool.addDomain("chargebot", { cognitoDomain: { domainPrefix: "chargebot" } });
    }
    else if (app.stage === "staging") {
        stagingCognito.cdk.userPool.addDomain("chargebotstaging", { cognitoDomain: { domainPrefix: "chargebotstaging" } });
    }
    else if (app.stage === "dev") {
        stagingCognito.cdk.userPool.addDomain("chargebotdev", { cognitoDomain: { domainPrefix: "chargebotdev" } });
    }
    stagingCognito.attachPermissionsForAuthUsers(stack, ["ssm"]);
    return stagingCognito;
};
const setupCognitoDevProd = (app, stack, baseUrl, deepLinkUrl, signInUrl, cognitoCustomMessageFunction, kmsKey) => {
    const TWILIO_ACCOUNT_SSID = new Config.Secret(stack, "TWILIO_ACCOUNT_SSID");
    const TWILIO_AUTH_TOKEN = new Config.Secret(stack, "TWILIO_AUTH_TOKEN");
    const TWILIO_PHONE_NUMBER = new Config.Secret(stack, "TWILIO_PHONE_NUMBER");
    const TWILIO_SENDER_SERVICE = new Config.Secret(stack, "TWILIO_SENDER_SERVICE");
    const COGNITO_KMS_SECRET_ALIAS = new Config.Secret(stack, "COGNITO_KMS_SECRET_ALIAS");
    const COGNITO_KMS_SECRET_ARN = new Config.Secret(stack, "COGNITO_KMS_SECRET_ARN");
    const COGNITO_KMS_SECRET_KEY_ID = new Config.Secret(stack, "COGNITO_KMS_SECRET_KEY_ID");
    // Cognito SMS Role
    const cognitoSmsRole = new iam.Role(stack, "CognitoSMSRole", {
        assumedBy: new iam.ServicePrincipal("cognito-idp.amazonaws.com"),
        managedPolicies: [
            { managedPolicyArn: "arn:aws:iam::aws:policy/AmazonSNSFullAccess" },
        ],
    });
    // Twilio layer: sms service
    const twilioLayer = new lambda.LayerVersion(stack, "twilio-layer", {
        code: lambda.Code.fromAsset("layers/twilio"),
    });
    const cognitoCustomSmsSenderFunction = new Function(stack, "cognitoCustomSmsSenderFunction", {
        handler: "packages/functions/src/api/cognito_custom_sms_sender.main",
        timeout: app.stage === "prod" ? "30 seconds" : "60 seconds",
        // @ts-expect-error ignore type errors
        layers: [twilioLayer],
        nodejs: {
            install: ["twilio"],
        },
        environment: {
            DEEP_LINK_URL: deepLinkUrl,
        },
        bind: [TWILIO_ACCOUNT_SSID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, TWILIO_SENDER_SERVICE, COGNITO_KMS_SECRET_ALIAS, COGNITO_KMS_SECRET_ARN, COGNITO_KMS_SECRET_KEY_ID],
    });
    cognitoCustomSmsSenderFunction.addToRolePolicy(
    // @ts-expect-error ignore type errors
    new iam.PolicyStatement({
        actions: ["kms:Decrypt", "kms:GenerateDataKey"],
        resources: [kmsKey.keyArn],
    }));
    const cognitoConfig = new Cognito(stack, "EmailAndPhoneAuth", {
        // Sign-in attributes. Usernames can be an email address, phone number, or a user-selected username.
        // When you select only email and phone, users must select either email or phone as their username type.
        // When username is an option, users can sign in with any options you select if they have provided a value for that option.
        login: ["username", "email", "phone"],
        triggers: {
            customMessage: cognitoCustomMessageFunction,
            customSmsSender: cognitoCustomSmsSenderFunction
            // preAuthentication: preAuthLambda
        },
        cdk: {
            userPool: {
                selfSignUpEnabled: app.stage !== "prod",
                autoVerify: {
                    email: true,
                    phone: true,
                },
                accountRecovery: cognito.AccountRecovery.PHONE_WITHOUT_MFA_AND_EMAIL,
                userVerification: {
                    emailSubject: "Verify your new Sust Pro account",
                    // emailStyle: cognito.VerificationEmailStyle.CODE,
                    smsMessage: "Your Sust Pro verification code is {####}",
                },
                standardAttributes: {
                    locale: { required: false, mutable: true },
                    givenName: { required: false, mutable: true },
                    familyName: { required: false, mutable: true },
                    profilePicture: { required: false, mutable: true },
                    phoneNumber: { required: false, mutable: true },
                },
                customAttributes: {
                    customerId: new cognito.NumberAttribute({ mutable: false }),
                    userSub: new cognito.StringAttribute({ mutable: true }),
                    invitationMethod: new cognito.StringAttribute({ mutable: true }),
                },
                passwordPolicy: {
                    minLength: 8,
                    requireDigits: false,
                    requireLowercase: false,
                    requireUppercase: false,
                    requireSymbols: false,
                    tempPasswordValidity: toCdkDuration('30 day')
                },
                signInAliases: {
                    username: true,
                    email: true,
                    phone: true,
                },
                // @ts-expect-error ignore
                smsRole: cognitoSmsRole,
                customSenderKmsKey: kmsKey
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
                    callbackUrls: [baseUrl],
                    logoutUrls: [signInUrl],
                    scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.PHONE]
                },
                preventUserExistenceErrors: true,
                enableTokenRevocation: true,
                refreshTokenValidity: toCdkDuration('180 days'),
            }
        }
    });
    if (app.stage === "prod") {
        cognitoConfig.cdk.userPool.addDomain("chargebot", { cognitoDomain: { domainPrefix: "chargebot-phone" } });
    }
    else if (app.stage === "staging") {
        cognitoConfig.cdk.userPool.addDomain("chargebotstaging", { cognitoDomain: { domainPrefix: "chargebotstaging-phone" } });
    }
    else if (app.stage === "dev") {
        cognitoConfig.cdk.userPool.addDomain("chargebotdev", { cognitoDomain: { domainPrefix: "chargebotdev-phone" } });
    }
    cognitoConfig.attachPermissionsForAuthUsers(stack, ["ssm"]);
    return cognitoConfig;
};
export function CognitoStack({ app, stack }) {
    // Secret Keys
    const COGNITO_USER_POOL_ID = new Config.Secret(stack, "COGNITO_USER_POOL_ID");
    // Cognito admin role
    const cognitoAdminRole = new iam.Role(stack, "CognitoAdminRole", {
        assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
            { managedPolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" },
        ],
    });
    const policy = new iam.Policy(stack, "CognitoAdminRolePolicy", {
        policyName: 'lambda_iot_policy',
        statements: [new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                    "cognito-idp:ListUsers",
                    "cognito-idp:AdminListGroupsForUser",
                    "cognito-idp:CreateGroup",
                    "cognito-idp:AdminAddUserToGroup",
                    "cognito-idp:AdminInitiateAuth",
                    "cognito-idp:AdminConfirmSignUp",
                    "cognito-idp:AdminCreateUser",
                    "cognito-idp:AdminDeleteUser",
                    "cognito-idp:AdminGetUser",
                    "cognito-idp:AdminDisableUser",
                    "cognito-idp:AdminEnableUser",
                    "cognito-idp:AdminResetUserPassword",
                    "sns:Publish",
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
    const baseUrl = app.stage === "prod"
        ? "https://chargebot-web-app.vercel.app"
        : (app.stage === "dev"
            ? "https://chargebot-web-app-livesust-daniels-projects-f33e53d9.vercel.app" //"https://localhost:3000"
            : "https://chargebot-web-app-livesust-daniels-projects-f33e53d9.vercel.app");
    const deepLinkUrl = `${baseUrl}/chargebot-app`;
    const signInUrl = `${baseUrl}/auth/cognito/sign-in`;
    const forgotPasswordUrl = `${baseUrl}/auth/cognito/update-password`;
    const cognitoCustomMessageFunction = new Function(stack, "cognitoCustomMessageFunction", {
        handler: "packages/functions/src/api/cognito_custom_message_handler.main",
        timeout: app.stage === "prod" ? "30 seconds" : "60 seconds",
        copyFiles: [{ from: 'packages/functions/src/shared/templates', to: 'packages/functions/src/shared/templates' }],
        // @ts-expect-error ignore type errors
        layers: [fsExtraLayer],
        nodejs: {
            install: ["fs-extra"],
        },
        environment: {
            DEEP_LINK_URL: deepLinkUrl,
            AUTH_SIGN_IN_URL: signInUrl,
            FORGOT_PASSWORD_URL: forgotPasswordUrl
        }
    });
    // const preAuthLambda = new Function(stack, "PreAuthLambda", {
    //   handler: "packages/functions/src/authenticate_user.main",
    //   // @ts-expect-error ignore check
    //   role: cognitoAdminRole,
    //   bind: [COGNITO_USER_POOL_ID],
    // });
    const kmsKey = setupKms(stack);
    let cognitoConfig = null;
    if (app.stage === "staging") {
        cognitoConfig = setupCognitoStaging(app, stack, baseUrl, signInUrl, cognitoCustomMessageFunction);
    }
    else {
        cognitoConfig = setupCognitoDevProd(app, stack, baseUrl, deepLinkUrl, signInUrl, cognitoCustomMessageFunction, kmsKey);
    }
    if (app.stage !== "dev") {
        // SES Verified Domain ARN
        const domainName = "sust.pro";
        // Create SES email verification
        // new VerifySesEmailAddress(stack, 'SesEmailVerification', {
        //   emailAddress: `no-reply@${domainName}`
        // });
        const sesEmailIdentity = new ses.EmailIdentity(stack, `SESEmailIdentity_${app.stage}`, {
            identity: ses.Identity.email(`no-reply@${domainName}`),
            dkimSigning: true, // Enables DKIM signing
        });
        // Create SES domain identity and enable DKIM
        const sesDomainIdentity = new ses.EmailIdentity(stack, `SESIdentity_${app.stage}`, {
            identity: ses.Identity.domain(domainName),
            dkimSigning: true, // Enables DKIM signing
        });
        const sesVerifiedDomainArn = `arn:aws:ses:${app.region}:${app.account}:identity/no-reply@${domainName}`;
        // Set up the SES Email Configuration in Cognito
        const emailConfiguration = {
            emailSendingAccount: 'DEVELOPER',
            sourceArn: sesVerifiedDomainArn,
            from: `ChargeBot by Sust Pro <no-reply@${domainName}>`, // Custom email address
        };
        // @ts-expect-error ignore check
        const cfnUserPool = cognitoConfig.cdk.userPool.node.defaultChild;
        cfnUserPool.emailConfiguration = emailConfiguration;
        stack.addOutputs({
            SESCNAMEDomainDnsRecord1: JSON.stringify({ "name": sesDomainIdentity.dkimDnsTokenName1, "value": sesDomainIdentity.dkimDnsTokenValue1 }),
            SESCNAMEDomainDnsRecord2: JSON.stringify({ "name": sesDomainIdentity.dkimDnsTokenName2, "value": sesDomainIdentity.dkimDnsTokenValue2 }),
            SESCNAMEDomainDnsRecord3: JSON.stringify({ "name": sesDomainIdentity.dkimDnsTokenName3, "value": sesDomainIdentity.dkimDnsTokenValue3 }),
            SESEmailDnsRecord1: JSON.stringify({ "name": sesEmailIdentity.dkimDnsTokenName1, "value": sesEmailIdentity.dkimDnsTokenValue1 }),
            SESEmailDnsRecord2: JSON.stringify({ "name": sesEmailIdentity.dkimDnsTokenName2, "value": sesEmailIdentity.dkimDnsTokenValue2 }),
            SESEmailDnsRecord3: JSON.stringify({ "name": sesEmailIdentity.dkimDnsTokenName3, "value": sesEmailIdentity.dkimDnsTokenValue3 }),
        });
    }
    // Cron function to expire user invitations
    const { rdsCluster } = use(RDSStack);
    new Cron(stack, "ExpireUserInvitationsCron", {
        schedule: app.stage === "dev" ? "rate(60 minutes)" : "rate(1 day)",
        job: {
            function: {
                handler: "packages/functions/src/api/expire_user_invitation.main",
                timeout: app.stage === "prod" ? "30 seconds" : "60 seconds",
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
        CognitoKmsKeyId: kmsKey.keyId,
        CognitoKmsKeyArn: kmsKey.keyArn,
    });
    return {
        cognito: cognitoConfig,
        cognitoAdminRole,
        COGNITO_USER_POOL_ID,
    };
}
