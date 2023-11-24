import { Kysely, PostgresDialect, ParseJSONResultsPlugin } from "kysely";
import { Pool } from 'pg';
import { ChargebotGpsTable } from "./chargebot_gps";
import { Config } from "sst/node/config";

export interface AnalyticsDatabase {
    chargebot_gps: ChargebotGpsTable
}

// Configs secrets are set with the following command
// pnpm sst secrets set TIMESCALE_HOST hostname
const psqlDialect = new PostgresDialect({
    pool: new Pool({
        database: Config.TIMESCALE_DATABASE,
        host: Config.TIMESCALE_HOST,
        ssl: true,
        user: Config.TIMESCALE_USER,
        password: Config.TIMESCALE_PASSWORD,
        port: +Config.TIMESCALE_PORT,
        max: 10,
    })
})

export default new Kysely<AnalyticsDatabase>({
    dialect: psqlDialect,
    plugins: [new ParseJSONResultsPlugin()],
});
