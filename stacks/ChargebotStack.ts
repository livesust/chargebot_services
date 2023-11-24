import { StackContext, Config, Api, use } from "sst/constructs";
import { RDSStack } from "./RDSStack";
import { CognitoStack } from "./CognitoStack";
import routes from './routes';
import { IRole, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export function ChargebotStack({ stack }: StackContext) {
    const { rdsCluster } = use(RDSStack);
    const { cognito } = use(CognitoStack);

    const TIMESCALE_HOST = new Config.Secret(stack, "TIMESCALE_HOST");
    const TIMESCALE_USER = new Config.Secret(stack, "TIMESCALE_USER");
    const TIMESCALE_PASSWORD = new Config.Secret(stack, "TIMESCALE_PASSWORD");
    const TIMESCALE_PORT = new Config.Secret(stack, "TIMESCALE_PORT");
    const TIMESCALE_DATABASE = new Config.Secret(stack, "TIMESCALE_DATABASE");

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
                bind: [rdsCluster, TIMESCALE_HOST, TIMESCALE_USER, TIMESCALE_PASSWORD, TIMESCALE_PORT, TIMESCALE_DATABASE],
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
