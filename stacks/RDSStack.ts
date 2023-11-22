import { StackContext, RDS } from "sst/constructs";

export function RDSStack({ app, stack }: StackContext) {

    // Create the Aurora DB cluster
    const DATABASE = "chargebot";

    const rdsCluster = new RDS(stack, "RDSCluster", {
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

    stack.addOutputs({
        RDSSecretArn: rdsCluster.secretArn,
        RDSClusterEndpoint: JSON.stringify(rdsCluster.clusterEndpoint),
        RDSClusterIdentifier: rdsCluster.clusterIdentifier,
    });

    return {
        rdsCluster,
    };
}
