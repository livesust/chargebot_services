import { StackContext, Api, use, attachPermissionsToRole } from "sst/constructs";
import { RDSStack } from "./RDSStack";
import { CognitoStack } from "./CognitoStack";
import routes from './routes';
import { IRole, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export function ChargebotStack({ stack }: StackContext) {
    const { rdsCluster } = use(RDSStack);
    const { cognito } = use(CognitoStack);

    // Create an IAM role
    const iamRole: IRole = new Role(stack, "ApiRole", {
        assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
            {
                managedPolicyArn:
                "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
            },
        ],
    });
    // Attach permissions to role
    // @ts-expect-error ignore error
    //attachPermissionsToRole(iamRole, [rdsCluster, cognito]);

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
                bind: [rdsCluster],
                // @ts-expect-error ignore error
                role: iamRole
            },
        },
    });

    for (const route of routes) {
        api.addRoutes(stack, route);
    }

    // allowing authenticated users to access API
    cognito.attachPermissionsForAuthUsers(stack, [api]);

    stack.addOutputs({
        ApiEndpoint: api.url,
        ApiDomainUrl: api.customDomainUrl
    });
}
