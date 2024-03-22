import { Kysely, PostgresDialect, ParseJSONResultsPlugin } from "kysely";
import { Pool } from 'pg';
import { ChargebotGpsTable } from "./chargebot_gps";
import { ChargebotBatteryTable } from "./chargebot_battery";
import { ChargebotInverterTable } from "./chargebot_inverter";
import { ChargebotPDUTable } from "./chargebot_pdu";
import { ChargebotErrorTable } from "./chargebot_error";
import { Config } from "sst/node/config";

export interface AnalyticsDatabase {
    chargebot_gps: ChargebotGpsTable,
    chargebot_battery: ChargebotBatteryTable,
    chargebot_inverter: ChargebotInverterTable,
    chargebot_pdu: ChargebotPDUTable,
    chargebot_error: ChargebotErrorTable,
}

// Configs secrets are set with the following command
// npx sst secrets --stage stage-name set TIMESCALE_HOST hostname
const psqlDialect = new PostgresDialect({
    pool: new Pool({
        database: Config.TIMESCALE_DATABASE,
        host: Config.TIMESCALE_HOST,
        ssl: true,
        user: Config.TIMESCALE_USER,
        password: Config.TIMESCALE_PASSWORD,
        port: +Config.TIMESCALE_PORT,
        max: 100,
        min: 10
    })
})

export default new Kysely<AnalyticsDatabase>({
    dialect: psqlDialect,
    plugins: [new ParseJSONResultsPlugin()],
    log(event): void {
      if (event.level === 'query') {
        console.log(`Timescale > Time: ${event.queryDurationMillis} < SQL: ${event.query.sql}`);
      }
    },
});
