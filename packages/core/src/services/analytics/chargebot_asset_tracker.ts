export * as ChargebotAssetTracker from "./chargebot_asset_tracker";
import { sql } from "kysely";
import db from '../../timescale';
import { AssetTrackerVariables } from "../../timescale/chargebot_asset_tracker";

export async function getAssetTrackerTagsStatus(bot_uuid: string): Promise<{
  rfid: string,
  timestamp: Date,
  status: string,
  last_known_latitude: number,
  last_known_longitude: number,
  last_known_address: string
}[]> {
  const results = await db
    .with(
      'status_groups',
      // Get report data
      (db) => db
        .selectFrom("chargebot_asset_tracker")
        // @ts-expect-error implicit any
        .select(() => [
          sql`address as rfid`,
          sql`value_string as status`,
          sql`timestamp`,
          sql`ROW_NUMBER() OVER (PARTITION BY address, value_string ORDER BY timestamp DESC) AS group_num`,
        ])
        .where('device_id', '=', bot_uuid)
        .where('variable', '=', AssetTrackerVariables.STATUS)
    )
    .with(
      'assets_timestamps',
      // Get report data
      (db) => db
        .selectFrom("status_groups")
        .select(() => [
          sql`rfid`,
          sql`MAX(CASE WHEN status = 'PRESENT' THEN timestamp END) AS last_present`,
          sql`MIN(CASE WHEN status = 'ABSENT' THEN timestamp END) AS first_absent`,
          sql`MIN(CASE WHEN status = 'AT_HOME' THEN timestamp END) AS first_at_home`,
        ])
        .where('group_num', '=', 1)
        .groupBy('rfid')
    )
    .with(
      'bot_location_absent',
      // Get report data
      (db) => db
        .selectFrom(["chargebot_gps", "assets_timestamps"])
        // @ts-expect-error implicit any
        .select(() => [
          sql`chargebot_gps.device_id as device_id`,
          sql`assets_timestamps.rfid`,
          sql`last(chargebot_gps.lat, chargebot_gps.timestamp) as latitude_absent`,
          sql`last(chargebot_gps.lon, chargebot_gps.timestamp) as longitude_absent`,
          sql`max(chargebot_gps.timestamp) as timestamp_absent`
        ])
        .where('chargebot_gps.device_id', '=', bot_uuid)
        .where('chargebot_gps.timestamp', '<=', sql`assets_timestamps.first_absent`)
        .groupBy(['chargebot_gps.device_id', 'assets_timestamps.rfid'])
    )
    .with(
      'bot_location_at_home',
      // Get report data
      (db) => db
        .selectFrom(["chargebot_gps", "assets_timestamps"])
        // @ts-expect-error implicit any
        .select(() => [
          sql`chargebot_gps.device_id as device_id`,
          sql`assets_timestamps.rfid`,
          sql`last(chargebot_gps.lat, chargebot_gps.timestamp) as latitude_at_home`,
          sql`last(chargebot_gps.lon, chargebot_gps.timestamp) as longitude_at_home`,
          sql`max(chargebot_gps.timestamp) as timestamp_at_home`
        ])
        .where('chargebot_gps.device_id', '=', bot_uuid)
        .where('chargebot_gps.timestamp', '<=', sql`assets_timestamps.first_at_home`)
        .groupBy(['chargebot_gps.device_id', 'assets_timestamps.rfid'])
    )
    .with(
      'bot_location_present',
      // Get report data
      (db) => db
        .selectFrom(["chargebot_gps", "assets_timestamps"])
        // @ts-expect-error implicit any
        .select(() => [
          sql`chargebot_gps.device_id as device_id`,
          sql`assets_timestamps.rfid`,
          sql`first(chargebot_gps.lat, chargebot_gps.timestamp) as latitude_present`,
          sql`first(chargebot_gps.lon, chargebot_gps.timestamp) as longitude_present`,
          sql`max(chargebot_gps.timestamp) as timestamp_present`
        ])
        .where('chargebot_gps.device_id', '=', bot_uuid)
        .where('chargebot_gps.timestamp', '>=', sql`assets_timestamps.last_present`)
        .groupBy(['chargebot_gps.device_id', 'assets_timestamps.rfid'])
    )
    .with(
      'bot_assets',
      // Get report data
      (db) => db
        .selectFrom(["chargebot_asset_tracker", "bot_location_absent", "bot_location_present"])
        .select(() => [
          sql`chargebot_asset_tracker.address as rfid`,
          sql`
          CASE
            WHEN last(chargebot_asset_tracker.value_string, chargebot_asset_tracker.timestamp) = 'PRESENT' then
            (select blp.timestamp_present from bot_location_present blp where blp.device_id=chargebot_asset_tracker.device_id and blp.rfid=chargebot_asset_tracker.address)
            WHEN last(chargebot_asset_tracker.value_string, chargebot_asset_tracker.timestamp) = 'ABSENT' then
            (select bla.timestamp_absent from bot_location_absent bla where bla.device_id=chargebot_asset_tracker.device_id and bla.rfid=chargebot_asset_tracker.address)
            WHEN last(chargebot_asset_tracker.value_string, chargebot_asset_tracker.timestamp) = 'AT_HOME' then
            (select blh.timestamp_at_home from bot_location_at_home blh where blh.device_id=chargebot_asset_tracker.device_id and blh.rfid=chargebot_asset_tracker.address)
          end as timestamp
          `,
          sql`last(chargebot_asset_tracker.value_string, chargebot_asset_tracker.timestamp) as status`,
          sql`CASE
                WHEN last(chargebot_asset_tracker.value_string, chargebot_asset_tracker.timestamp) = 'PRESENT' THEN
                (select blp.latitude_present from bot_location_present blp where blp.device_id=chargebot_asset_tracker.device_id and blp.rfid=chargebot_asset_tracker.address)
                WHEN last(chargebot_asset_tracker.value_string, chargebot_asset_tracker.timestamp) = 'ABSENT' THEN
                (select bla.latitude_absent from bot_location_absent bla where bla.device_id=chargebot_asset_tracker.device_id and bla.rfid=chargebot_asset_tracker.address)
                WHEN last(chargebot_asset_tracker.value_string, chargebot_asset_tracker.timestamp) = 'AT_HOME' then
                (select blh.latitude_at_home from bot_location_at_home blh where blh.device_id=chargebot_asset_tracker.device_id and blh.rfid=chargebot_asset_tracker.address)
              end as latitude`,
          sql`CASE
                WHEN last(chargebot_asset_tracker.value_string, chargebot_asset_tracker.timestamp) = 'PRESENT' THEN
                (select blp.longitude_present from bot_location_present blp where blp.device_id=chargebot_asset_tracker.device_id and blp.rfid=chargebot_asset_tracker.address)
                WHEN last(chargebot_asset_tracker.value_string, chargebot_asset_tracker.timestamp) = 'ABSENT' THEN
                (select bla.longitude_absent from bot_location_absent bla where bla.device_id=chargebot_asset_tracker.device_id and bla.rfid=chargebot_asset_tracker.address)
                WHEN last(chargebot_asset_tracker.value_string, chargebot_asset_tracker.timestamp) = 'AT_HOME' then
                (select blh.longitude_at_home from bot_location_at_home blh where blh.device_id=chargebot_asset_tracker.device_id and blh.rfid=chargebot_asset_tracker.address)
              end as longitude`
        ])
        .where('chargebot_asset_tracker.device_id', '=', bot_uuid)
        .where('variable', '=', AssetTrackerVariables.STATUS)
        .groupBy(['chargebot_asset_tracker.device_id', 'chargebot_asset_tracker.address'])
    )
    .selectFrom('bot_assets')
    // @ts-expect-error implicit any
    .select([
      sql`rfid`,
      sql`timestamp`,
      sql`status`,
      sql`latitude as last_known_latitude`,
      sql`longitude as last_known_longitude`,
      sql`(select
              concat(chargebot_geocoding.address_number, ' ', chargebot_geocoding.street, ', ', chargebot_geocoding.city)
          from chargebot_geocoding
          where bot_assets.latitude = ANY(chargebot_geocoding.latitudes)
          and bot_assets.longitude = ANY(chargebot_geocoding.longitudes)
      ) as last_known_address`
    ])
    .orderBy('status', 'desc')
    .orderBy('rfid', 'asc')
    .execute();

    // @ts-expect-error not overloads match
    return results;
}
