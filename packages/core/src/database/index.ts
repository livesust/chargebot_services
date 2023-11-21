import { Kysely, ParseJSONResultsPlugin } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDSData } from "@aws-sdk/client-rds-data";
import { RDS } from "sst/node/rds";
import { BotTable } from "./bot";
import { CustomerTable } from "./customer";
import { CompanyTable } from "./company";
// DO NOT REMOVE THIS LINE: PLOP ENTITY IMPORT

export interface Database {
  bot: BotTable,
  customer: CustomerTable,
  company: CompanyTable,
// DO NOT REMOVE THIS LINE: PLOP ENTITY LIST
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
    plugins: [new ParseJSONResultsPlugin()],
});
