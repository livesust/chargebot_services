import { Kysely, PostgresDialect, ParseJSONResultsPlugin } from "kysely";
import { Pool } from 'pg';
import { ChargebotGpsTable } from "./chargebot_gps";
import { ChargebotBatteryTable } from "./chargebot_battery";
import { ChargebotInverterTable } from "./chargebot_inverter";
import { ChargebotPDUTable } from "./chargebot_pdu";
import { ChargebotErrorTable } from "./chargebot_error";
import { ChargebotAlertTable } from "./chargebot_alert";
import { ChargebotGeocodingTable } from "./chargebot_geocoding";
import { ChargebotSystemTable } from "./chargebot_system";
import { ChargebotTemperatureTable } from "./chargebot_temperature";
import { ChargebotFanTable } from "./chargebot_fan";
import { ChargebotAssetTrackerTable } from "./chargebot_asset_tracker";
import { Config } from "sst/node/config";

export interface AnalyticsDatabase {
    chargebot_gps: ChargebotGpsTable,
    chargebot_battery: ChargebotBatteryTable,
    chargebot_inverter: ChargebotInverterTable,
    chargebot_pdu: ChargebotPDUTable,
    chargebot_error: ChargebotErrorTable,
    chargebot_alert: ChargebotAlertTable,
    chargebot_geocoding: ChargebotGeocodingTable,
    chargebot_system: ChargebotSystemTable,
    chargebot_temperature: ChargebotTemperatureTable,
    chargebot_fan: ChargebotFanTable,
    chargebot_asset_tracker: ChargebotAssetTrackerTable,
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
        // maximum number of clients the pool should contain
        // by default this is set to 10.
        max: 25,
        // number of milliseconds a client must sit idle in the pool and not be checked out
        // before it is disconnected from the backend and discarded
        // default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
        idleTimeoutMillis: 30000,
        // timeout for new connections
        connectionTimeoutMillis: 10000
    })
})

export default new Kysely<AnalyticsDatabase>({
    dialect: psqlDialect,
    plugins: [new ParseJSONResultsPlugin()],
    // log(event): void {
    //   if (event.level === 'query') {
    //     console.log(`TimescaleDB Time: ${Math.round(event.queryDurationMillis)}ms
    //       SQL: ${event.query.sql}
    //       Params: ${JSON.stringify(event.query.parameters, null, 2)}`);
    //   }
    // },
});
