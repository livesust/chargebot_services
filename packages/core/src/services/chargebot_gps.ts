export * as ChargebotGps from "./chargebot_gps";
import db from '../analytics';
import { ChargebotGps } from "../analytics/chargebot_gps";

export async function getByBot(bot_uuid: string): Promise<ChargebotGps[]> {
    return await db
        .selectFrom("chargebot_gps")
        .select([
            'device_id',
            'device_version',
            'timestamp',
            'timezone',
            'lat',
            'lat_unit',
            'lon',
            'lon_unit',
            'altitude',
            'altitude_unit',
            'speed',
            'speed_unit',
            'bearing',
            'bearing_unit',
            'vehicle_status',
            'quality',
            'nav_mode',
            'error',
        ])
        .where('device_id', '=', bot_uuid)
        .orderBy('timestamp', 'desc')
        .limit(10)
        .execute();
}
