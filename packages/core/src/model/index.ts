import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDSData } from "@aws-sdk/client-rds-data";
import { RDS } from "sst/node/rds";
import { Bot } from "./bot";

export interface Database {
  bot: Bot
}

export default new Kysely<Database>({
  dialect: new DataApiDialect({
    mode: "postgres",
    driver: {
      database: RDS.RDSCluster.defaultDatabaseName,
      secretArn: RDS.RDSCluster.secretArn,
      resourceArn: RDS.RDSCluster.clusterArn,
      client: new RDSData({}),
    },
  }),
});