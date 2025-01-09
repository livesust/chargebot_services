import { StackContext, Config, Cognito, toCdkDuration, use, Cron, Function } from "sst/constructs";
import { RDSStack } from "./RDSStack";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ses from "aws-cdk-lib/aws-ses";

export function CognitoStack({ app, stack }: StackContext) {

    // Secret Keys
    const COGNITO_USER_POOL_ID = new Config.Secret(stack, "COGNITO_USER_POOL_ID");
    const COGNITO_EMAIL_PHONE_USER_POOL_ID = new Config.Secret(stack, "COGNITO_EMAIL_PHONE_USER_POOL_ID");

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

    // Cognito SMS Role
    const cognitoSmsRole: iam.IRole = new iam.Role(stack, "CognitoSMSRole", {
      assumedBy: new iam.ServicePrincipal("cognito-idp.amazonaws.com"),
      managedPolicies: [
        { managedPolicyArn: "arn:aws:iam::aws:policy/AmazonSNSFullAccess" },
      ],
    });

    // Cognito user pool authentication
    // @ts-expect-error ignore type errors
    const fsExtraLayer = new lambda.LayerVersion(stack, "fsExtra-layer", {
      code: lambda.Code.fromAsset("layers/fs-extra"),
    });

    const cognitoCustomMessageFunction = new Function(stack, "cognitoCustomMessageFunction", {
      handler: "packages/functions/src/api/cognito_custom_message_handler.main",
      timeout: app.stage === "prod" ? "30 seconds" : "60 seconds",
      copyFiles: [{ from: 'packages/functions/src/shared/templates', to: 'packages/functions/src/shared/templates'}],
      // @ts-expect-error ignore type errors
      layers: [fsExtraLayer],
      nodejs: {
        install: ["fs-extra"],
      },
      environment: {
        AUTH_SIGN_IN_URL: app.stage === "dev" ? "http://localhost:3000/auth/cognito/sign-in" : "https://chargebot-web-app.vercel.app/auth/cognito/sign-in",
        FORGOT_PASSWORD_URL: app.stage === "dev" ? "http://localhost:3000/auth/cognito/update-password" : "https://chargebot-web-app.vercel.app/auth/cognito/update-password"
      }
    });

    const emailOnlyCognitoConfig = new Cognito(stack, "Auth", {
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

    const preAuthLambda = new Function(stack, "PreAuthLambda", {
      handler: "packages/functions/src/authenticate_user.main",
      // @ts-expect-error ignore check
      role: cognitoAdminRole,
      bind: [COGNITO_USER_POOL_ID, COGNITO_EMAIL_PHONE_USER_POOL_ID],
    });

    const signInUrl = app.stage === "prod"
      ? ["https://chargebot-web-app.vercel.app/auth/cognito/sign-in"]
      : (
        app.stage === "dev"
        ? ["http://localhost:3000/auth/cognito/sign-in"]
        : ["https://chargebot-web-app.vercel.app/cognito/sign-in"]
    );
    const emailPhoneCognitoConfig = new Cognito(stack, "EmailPhoneAuth", {
        login: ["email", "phone"],
        triggers: {
          customMessage: cognitoCustomMessageFunction,
          // preAuthentication: preAuthLambda
        },
        cdk: {
            userPool: {
                selfSignUpEnabled: app.stage !== "prod",
                autoVerify: {
                    email: true,
                    phone: true
                },
                accountRecovery: cognito.AccountRecovery.PHONE_WITHOUT_MFA_AND_EMAIL,
                userVerification: {
                    emailSubject: "Verify your new Sust Pro account",
                    // emailStyle: cognito.VerificationEmailStyle.CODE,
                    smsMessage: "Your Sust Pro verification code is {####}",
                },
                userInvitation: {
                  smsMessage: `Your Sust Pro username is {username} and temporary password is {####} ${signInUrl}`,
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
                    email: true,
                    phone: true,
                },
                // @ts-expect-error ignore
                smsRole: cognitoSmsRole
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
                    logoutUrls: signInUrl,
                    scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.PHONE]
                },
                preventUserExistenceErrors: true,
                enableTokenRevocation: true,
                refreshTokenValidity: toCdkDuration('180 days'),
            }
        }
    });

    if (app.stage === "prod") {
      emailOnlyCognitoConfig.cdk.userPool.addDomain("chargebot", { cognitoDomain: { domainPrefix: "chargebot" } })
      emailPhoneCognitoConfig.cdk.userPool.addDomain("chargebot", { cognitoDomain: { domainPrefix: "chargebot-phone" } })
    } else if (app.stage === "staging") {
      emailOnlyCognitoConfig.cdk.userPool.addDomain("chargebotstaging", { cognitoDomain: { domainPrefix: "chargebotstaging" } })
      emailPhoneCognitoConfig.cdk.userPool.addDomain("chargebotstaging", { cognitoDomain: { domainPrefix: "chargebotstaging-phone" } })
    } else if (app.stage === "dev") {
      emailOnlyCognitoConfig.cdk.userPool.addDomain("chargebotdev", { cognitoDomain: { domainPrefix: "chargebotdev" } })
      emailPhoneCognitoConfig.cdk.userPool.addDomain("chargebotdev", { cognitoDomain: { domainPrefix: "chargebotdev-phone" } })
    }

    emailOnlyCognitoConfig.attachPermissionsForAuthUsers(stack, ["ssm"])
    emailPhoneCognitoConfig.attachPermissionsForAuthUsers(stack, ["ssm"])

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
      const emailConfiguration: cognito.CfnUserPool.EmailConfigurationProperty = {
        emailSendingAccount: 'DEVELOPER', // Use "DEVELOPER" to send from SES
        sourceArn: sesVerifiedDomainArn, // SES domain ARN
        from: `ChargeBot by Sust Pro <no-reply@${domainName}>`, // Custom email address
      };

      // @ts-expect-error ignore check
      const cfnEmailOnlyUserPool = emailOnlyCognitoConfig.cdk.userPool.node.defaultChild as cognito.CfnUserPool;
      cfnEmailOnlyUserPool.emailConfiguration = emailConfiguration;

      // @ts-expect-error ignore check
      const cfnEmailPhoneUserPool = emailPhoneCognitoConfig.cdk.userPool.node.defaultChild as cognito.CfnUserPool;
      cfnEmailPhoneUserPool.emailConfiguration = emailConfiguration;

      stack.addOutputs({
          SESCNAMEDomainDnsRecord1: JSON.stringify({"name": sesDomainIdentity.dkimDnsTokenName1, "value": sesDomainIdentity.dkimDnsTokenValue1}),
          SESCNAMEDomainDnsRecord2: JSON.stringify({"name": sesDomainIdentity.dkimDnsTokenName2, "value": sesDomainIdentity.dkimDnsTokenValue2}),
          SESCNAMEDomainDnsRecord3: JSON.stringify({"name": sesDomainIdentity.dkimDnsTokenName3, "value": sesDomainIdentity.dkimDnsTokenValue3}),
          SESEmailDnsRecord1: JSON.stringify({"name": sesEmailIdentity.dkimDnsTokenName1, "value": sesEmailIdentity.dkimDnsTokenValue1}),
          SESEmailDnsRecord2: JSON.stringify({"name": sesEmailIdentity.dkimDnsTokenName2, "value": sesEmailIdentity.dkimDnsTokenValue2}),
          SESEmailDnsRecord3: JSON.stringify({"name": sesEmailIdentity.dkimDnsTokenName3, "value": sesEmailIdentity.dkimDnsTokenValue3}),
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
          bind: [rdsCluster, COGNITO_USER_POOL_ID, COGNITO_EMAIL_PHONE_USER_POOL_ID],
          // @ts-expect-error ignore check
          role: cognitoAdminRole,
        }
      },
    });

    stack.addOutputs({
        CognitoUserPoolId: emailOnlyCognitoConfig.userPoolId,
        CognitoIdentityPoolId: emailOnlyCognitoConfig.cognitoIdentityPoolId,
        CognitoUserPoolClientId: emailOnlyCognitoConfig.userPoolClientId,
        CognitoEmailPhoneUserPoolId: emailPhoneCognitoConfig.userPoolId,
        CognitoEmailPhoneIdentityPoolId: emailPhoneCognitoConfig.cognitoIdentityPoolId,
        CognitoEmailPhoneUserPoolClientId: emailPhoneCognitoConfig.userPoolClientId,
    });

    return {
        cognito: emailOnlyCognitoConfig,
        emailPhoneCognito: emailPhoneCognitoConfig,
        cognitoAdminRole,
        COGNITO_USER_POOL_ID,
        COGNITO_EMAIL_PHONE_USER_POOL_ID,
    };
}
