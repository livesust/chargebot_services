import { StackContext, RDS } from "sst/constructs";

export function RDSStack({ app, stack }: StackContext) {

  // Create the Aurora DB cluster
  const DATABASE = "chargebot";

  const prodConfig = {
    autoPause: false,
    minCapacity: 'ACU_8',
    maxCapacity: 'ACU_64',
  };

  const devConfig = {
    autoPause: 15,  // 15min inactive before the cluster is paused
    minCapacity: "ACU_2",
    maxCapacity: "ACU_2",
  };


  const rdsCluster = new RDS(stack, "RDSCluster", {
    engine: "postgresql13.9",
    defaultDatabaseName: DATABASE,
    migrations: "services/migrations",
    types: {
      path: "backend/core/sql/types.ts",
      camelCase: true
    },
    cdk: {
      cluster: {
        
      }
    },
    // @ts-expect-error ignore typing
    scaling: app.stage === "prod" ? prodConfig : devConfig,
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
