export * as ChargebotGps from "./chargebot_gps";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotGpsHistory, ChargebotGpsPosition, VehicleStatus } from "../../timescale/chargebot_gps";
import { ChargebotGpsAggregate } from "../../timescale/chargebot_gps_aggregate";

export interface ChargebotLocation {
  device_id: string,
  timestamp: Date,
  vehicle_status: string,
  lat: number,
  lon: number,
  altitude: number,
  speed: number,
  bearing: number,
  distance: number,
  arrived_at: Date | undefined,
  left_at: Date | undefined,
  address: string | undefined,
  country: string | undefined,
  state: string | undefined,
  county: string | undefined,
  city: string | undefined,
  neighborhood: string | undefined,
  street: string | undefined,
  address_number: string | undefined,
  postal_code: string | undefined,
  place_id: string | undefined,
  timezone: string | undefined,
  timezone_offset: number | undefined,
}

export function translateVehicleStatus(vehicle_status: VehicleStatus | string | undefined): string | undefined {
  if (!vehicle_status) {
    return undefined;
  }

  return vehicle_status == VehicleStatus.PARKED
    ? 'ON_LOCATION'
    : (
      vehicle_status == VehicleStatus.MOVING || vehicle_status == VehicleStatus.STOPPED
        ? 'IN_TRANSIT'
        : VehicleStatus.AT_HOME
    );
}

export async function getConnectionStatus(bot_uuid: string): Promise<{
  timestamp: Date,
  connected: boolean
}> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_gps_aggregate")
    // @ts-expect-error not overloads match
    .select(() => [
      sql`max(bucket) as timestamp`,
      sql`
      CASE
          WHEN max(bucket) < NOW() - INTERVAL '60 minutes' THEN false
          ELSE true
      END as connected`
    ])
    .where('device_id', '=', bot_uuid)
    .executeTakeFirst();
}

export async function getConnectionStatusByBots(bot_uuids: string[]): Promise<{
  bot_uuid: string,
  timestamp: Date,
  connected: boolean
}[]> {
  // @ts-expect-error not overloads match
  return db
    .selectFrom("chargebot_gps_aggregate")
    // @ts-expect-error not overloads match
    .select(() => [
      'device_id as bot_uuid',
      sql`max(bucket) as timestamp`,
      sql`
      CASE
          WHEN max(bucket) < NOW() - INTERVAL '60 minutes' THEN false
          ELSE true
      END as connected`
    ])
    .where('device_id', 'in', bot_uuids)
    .groupBy('device_id')
    // .orderBy('timestamp', 'desc')
    // .limit(1)
    .execute()
}

export async function countConnectionStatusByBots(bot_uuids: string[], conn_status: boolean): Promise<number> {
  const count: unknown[] = await db
    .with(
      'connection_status',
      (db) => db
        .selectFrom("chargebot_gps_aggregate")
        // @ts-expect-error not overloads match
        .select(() => [
          'device_id',
          sql`
          CASE
              WHEN max(bucket) < NOW() - INTERVAL '60 minutes' THEN false
              ELSE true
          END as connected`
        ])
        .where('device_id', 'in', bot_uuids)
        .groupBy('device_id')
    )
    .selectFrom('connection_status')
    .select('device_id')
    .where('connected', '=', conn_status)
    .groupBy('device_id')
    .execute()
    .catch(error => {
      console.log(error);
      throw error;
    });
    return count?.length ?? 0;
}

export async function getLastPositionByBots(botUuids: string[]): Promise<ChargebotGpsAggregate[]> {
  return db
    .with(
      'latest_position',
      (db) => db
        .selectFrom('chargebot_gps_aggregate')
        .select(({ fn }) => [
          fn.max('bucket').as('latest_timestamp'),
          'device_id'
        ])
        .where('device_id', '=', sql`ANY(${botUuids})`)
        .groupBy('device_id')
    )
    .selectFrom('chargebot_gps_aggregate')
    .selectAll('chargebot_gps_aggregate')
    .innerJoin('latest_position', 'latest_position.device_id', 'chargebot_gps_aggregate.device_id')
    .where('chargebot_gps_aggregate.bucket', '=', sql`latest_position.latest_timestamp`)
    .execute()
    .catch(error => {
      console.log(error);
      throw error;
    });
}

export async function getLastPositionByBot(bot_uuid: string): Promise<ChargebotLocation | undefined> {
  const location: ChargebotGpsAggregate | undefined = await db
  .selectFrom("chargebot_gps_aggregate")
  .selectAll()
  .where('device_id', '=', bot_uuid)
  .orderBy('bucket', 'desc')
  .limit(1)
  .executeTakeFirst();
  if (location) {
    const [arrived_at, left_at, geocoding] = await Promise.all([
      location.vehicle_status === VehicleStatus.AT_HOME
        ? getArrivedAtWhenAtHome(location)
        : (location.vehicle_status === VehicleStatus.PARKED ? await getArrivedAtWhenParked(location) : Promise.resolve(undefined)),
      
        location.vehicle_status === VehicleStatus.MOVING || location.vehicle_status === VehicleStatus.STOPPED ? await getLeftAtWhenInTransit(location) : Promise.resolve(undefined),

        getLastParkedAtHomePosition(bot_uuid)
    ])

    return {
      device_id: location.device_id,
      timestamp: location.bucket,
      vehicle_status: location.vehicle_status,
      lat: location.lat,
      lon: location.lon,
      altitude: location.altitude,
      speed: location.speed,
      bearing: location.bearing,
      distance: location.distance,
      arrived_at: arrived_at?.timestamp ?? undefined,
      left_at: left_at?.timestamp ?? undefined,
      address: geocoding?.address,
      country: geocoding?.country,
      state: geocoding?.state,
      county: geocoding?.county,
      city: geocoding?.city,
      neighborhood: geocoding?.neighborhood,
      street: geocoding?.street,
      address_number: geocoding?.address_number,
      postal_code: geocoding?.postal_code,
      place_id: geocoding?.place_id,
      timezone: geocoding?.timezone,
      timezone_offset: geocoding?.timezone_offset
    };
  }
}

export async function getRouteByBot(bot_uuid: string, from: Date, to: Date): Promise<ChargebotGpsPosition[] | undefined> {
  // @ts-expect-error ignore overload not mapping
  return await db
    .with(
      'block_status',
      (db) => db
        .selectFrom('chargebot_gps_aggregate')
        // @ts-expect-error ignore overload not mapping
        .select([
          'id',
          'bucket as timestamp',
          'lat as latitude',
          'lon as longitude',
          'vehicle_status',
          sql`lag(vehicle_status) over (order by "bucket") as prev_vehicle_status`,
          sql`lead(vehicle_status) over (order by "bucket") as next_vehicle_status`,
          'distance'
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('bucket', from, to))
    )
    .with(
      'block_status_fixed',
      (db) => db
        .selectFrom('block_status')
        .select([
          'id',
          'timestamp',
          'latitude',
          'longitude',
          'distance',
          sql`
            case 
              when vehicle_status = 'AT_HOME' then 'AT_HOME'
              when vehicle_status = 'MOVING' then 'IN_TRANSIT'
              when vehicle_status = 'STOPPED' and next_vehicle_status = 'MOVING' then 'IN_TRANSIT'
              when vehicle_status = 'STOPPED' and next_vehicle_status = 'PARKED' then 'ON_LOCATION'
              when vehicle_status = 'PARKED' then 'ON_LOCATION'
            end as vehicle_status
          `
        ])
    )
    .with(
      'block_groups',
      (db) => db
        .selectFrom('block_status_fixed')
        // @ts-expect-error ignore overload not mapping
        .select([
          'id',
          'timestamp',
          'latitude',
          'longitude',
          'distance',
          'vehicle_status',
          sql`
            ROW_NUMBER() OVER (PARTITION BY to_char("timestamp", 'YYYY-MM-dd') ORDER BY "timestamp" DESC) -
            ROW_NUMBER() OVER (PARTITION BY vehicle_status ORDER BY "timestamp" DESC) AS block
          `
        ])
    )
    .selectFrom('block_groups')
    .select([
      sql`max(id) as id`,
      sql`min(timestamp) as timestamp`,
      'latitude',
      'longitude',
      'vehicle_status',
      sql`sum(distance) as distance`
    ])
    .groupBy(['block', 'vehicle_status', 'latitude', 'longitude'])
    .orderBy('timestamp', 'asc')
    .execute();
}

export async function getSummaryByBot(bot_uuid: string, from: Date, to: Date): Promise<ChargebotGpsHistory[] | undefined> {
  // @ts-expect-error ignore overload not mapping
  return await db
    .with(
      'block_status',
      (db) => db
        .selectFrom('chargebot_gps_aggregate')
        // @ts-expect-error ignore overload not mapping
        .select([
          'id',
          'bucket as timestamp',
          'timezone',
          'lat as latitude',
          'lon as longitude',
          'distance',
          'vehicle_status',
          sql`lag(vehicle_status) over (order by "bucket") as prev_vehicle_status`,
          sql`lead(vehicle_status) over (order by "bucket") as next_vehicle_status`
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('bucket', from, to))
        .orderBy('bucket', 'asc')
    )
    .with(
      'block_status_fixed',
      (db) => db
        .selectFrom('block_status')
        .select([
          'id',
          'timestamp',
          'timezone',
          'latitude',
          'longitude',
          'distance',
          sql`
            case 
              when vehicle_status = 'AT_HOME' then 'AT_HOME'
              when vehicle_status = 'MOVING' then 'IN_TRANSIT'
              when vehicle_status = 'STOPPED' and next_vehicle_status = 'MOVING' then 'IN_TRANSIT'
              when vehicle_status = 'STOPPED' and next_vehicle_status = 'PARKED' then 'ON_LOCATION'
              when vehicle_status = 'PARKED' then 'ON_LOCATION'
            end as vehicle_status
          `
        ])
    )
    .with(
      'block_groups',
      (db) => db
        .selectFrom('block_status_fixed')
        // @ts-expect-error ignore overload not mapping
        .select([
          sql`max("id") as id`,
          'timestamp',
          sql`max("timezone") as timezone`,
          sql`max("latitude") as latitude`,
          sql`max("longitude") as longitude`,
          sql`max("distance") as distance`,
          sql`max("vehicle_status") as vehicle_status`,
          sql`
            ROW_NUMBER() OVER (PARTITION BY to_char("timestamp", 'YYYY-MM-dd') ORDER BY "timestamp" DESC) -
            ROW_NUMBER() OVER (PARTITION BY first("vehicle_status", "timestamp") ORDER BY "timestamp" DESC) AS block
          `
        ])
        .groupBy(['timestamp'])
    )
    .with(
      'block_grouped',
      (db) => db
        .selectFrom('block_groups')
        .select([
          'vehicle_status',
          sql`max("id") as id`,
          sql`min("timestamp") as start_timestamp`,
          sql`max("timestamp") as end_timestamp`,
          sql`min("timezone") as timezone`,
          sql`first("latitude", "timestamp") as latitude`,
          sql`first("longitude", "timestamp") as longitude`,
          sql`sum(distance) as distance`
        ])
        .groupBy(['vehicle_status', 'block'])
    )
    .with(
      'block_geocoding',
      (db) => db
        .selectFrom(['block_grouped as bg', 'chargebot_geocoding as cg'])
        // @ts-expect-error ignore
        .select([
          'cg.label as address',
          'cg.postal_code',
          'cg.country',
          'cg.state',
          'cg.county',
          'cg.city',
          'cg.neighborhood',
          'cg.street',
          'cg.address_number',
          'cg.latitudes',
          'cg.longitudes',
          sql`row_number() over (partition by bg.latitude, bg.longitude order by cg.timestamp desc) as geo_rn`
        ])
        .where(sql`bg.latitude = ANY(cg.latitudes)`)
        .where(sql`bg.longitude = ANY(cg.longitudes)`)
    )
    .selectFrom(['block_grouped', 'block_geocoding as geo'])
    .select([
      'block_grouped.id',
      sql`start_timestamp as start_time`,	
      sql`
        case 
          when lead(start_timestamp) over (order by "start_timestamp") is null then end_timestamp
          else lead(start_timestamp) over (order by "start_timestamp")
        end as end_time
      `,
      'block_grouped.timezone',	
      'latitude',
      'longitude',
      'distance',
      'vehicle_status',
      'geo.address',
      'geo.postal_code',
      'geo.country',
      'geo.state',
      'geo.county',
      'geo.city',
      'geo.neighborhood',
      'geo.street',
      'geo.address_number'
    ])
    .orderBy('start_timestamp', 'asc')
    .where('geo.geo_rn', '=', 1)
    .where(sql`block_grouped.latitude = ANY(geo.latitudes)`)
    .where(sql`block_grouped.longitude = ANY(geo.longitudes)`)
    .execute();
}

export async function getDaysWithData(bot_uuid: string, from: Date, to: Date): Promise<{
  bucket: Date,
  number_of_records: number
}[]> {
  const query = db
    .selectFrom("chargebot_gps_aggregate")
    // @ts-expect-error ignore overload not mapping
    .select(({ fn }) => [
      sql`time_bucket_gapfill('1 day', "bucket") AS bucket_gapfill`,
      fn.count<number>('device_id').as('number_of_records'),
    ])
    .where('device_id', '=', bot_uuid)
    .where((eb) => eb.between('bucket', from, to))
    .groupBy('bucket_gapfill')
    .orderBy('bucket_gapfill', 'asc');
  
  // @ts-expect-error not overloads match
  return query.execute();
}

async function getArrivedAtWhenAtHome(location: ChargebotGpsAggregate) {
  // Vehicle is currently AT_HOME
  // We need to find the min timestamp of the first AT_HOME in the current bucket of reports

  // Get the last report where vehicle was not AT_HOME
  /*
  WITH vehicle_status_groups AS (
      SELECT
          "timestamp",
          lat,
          lon,
          vehicle_status,
          ROW_NUMBER() OVER (ORDER BY timestamp DESC) - 
          ROW_NUMBER() OVER (PARTITION BY vehicle_status ORDER BY "timestamp" DESC) AS block
      FROM
          chargebot_gps
      where device_id = '85ab4178-5971-11ee-a3db-033507a860c9'
  )
  SELECT
      "timestamp",
      lat,
      lon,
      vehicle_status
  FROM
      vehicle_status_groups
  WHERE
      vehicle_status = 'AT_HOME'
      AND block = 0
  ORDER BY
      timestamp ASC
  LIMIT 1;
  */
  return db
    .with(
      'vehicle_status_groups',
      (db) => db
        .selectFrom('chargebot_gps_aggregate')
        // @ts-expect-error ignore overload not mapping
        .select([
          'min_timestamp as timestamp',
          'vehicle_status',
          sql`
            ROW_NUMBER() OVER (ORDER BY bucket DESC) -
            ROW_NUMBER() OVER (PARTITION BY vehicle_status ORDER BY "bucket" DESC) AS block
          `
        ])
        .where('device_id', '=', location.device_id)
    )
    .selectFrom('vehicle_status_groups')
    .select(['timestamp'])
    .where('vehicle_status', '=', VehicleStatus.AT_HOME)
    .where('block', '=', 0)
    .orderBy('timestamp', 'asc')
    .limit(1)
    .executeTakeFirst();
}

async function getArrivedAtWhenParked(location: ChargebotGpsAggregate) {
  // Vehicle is currently PARKED
  // We need to find the max timestamp of previous report where vehicle is not PARKED
  // in the current bucket of reports
  return db
    .with(
      'vehicle_status_groups',
      (db) => db
        .selectFrom('chargebot_gps_aggregate')
        // @ts-expect-error ignore overload not mapping
        .select([
          'max_timestamp as timestamp',
          'vehicle_status',
          sql`ROW_NUMBER() OVER (ORDER BY bucket DESC) - ROW_NUMBER() OVER (PARTITION BY vehicle_status ORDER BY "bucket" DESC) AS block`
        ])
        .where('device_id', '=', location.device_id)
    )
    .selectFrom('vehicle_status_groups')
    .select(['timestamp'])
    .where('vehicle_status', '!=', VehicleStatus.PARKED)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();
}

async function getLeftAtWhenInTransit(location: ChargebotGpsAggregate) {
  // Vehicle is currently MOVING or STOPPED
  // We need to find the min timestamp of the first MOVING in the current bucket of reports
  return db
    .with(
      'last_report_parked_home',
      // Get the last report where vehicle was PARKED/AT_HOME
      (db) => db
        .selectFrom('chargebot_gps_aggregate')
        .select(({ fn }) => [
          fn.max('chargebot_gps_aggregate.max_timestamp').as('max_timestamp'),
        ])
        .where('device_id', '=', location.device_id)
        .where('vehicle_status', 'in', [VehicleStatus.AT_HOME, VehicleStatus.PARKED])
        .where('max_timestamp', '<', location.bucket)
    )
    // Now get the first MOVING report after being PARKED/AT_HOME
    .selectFrom(['chargebot_gps_aggregate', 'last_report_parked_home'])
    .select(({ fn }) => [
      fn.min('chargebot_gps_aggregate.min_timestamp').as('timestamp'),
    ])
    .where('chargebot_gps_aggregate.device_id', '=', location.device_id)
    .where('chargebot_gps_aggregate.vehicle_status', '=', VehicleStatus.MOVING)
    .where(sql`chargebot_gps_aggregate.min_timestamp > last_report_parked_home.max_timestamp`)
    .executeTakeFirst();
}

async function getLastParkedAtHomePosition(bot_uuid: string): Promise<ChargebotLocation | undefined> {
  // @ts-expect-error ignore overload not mapping
  return db
    .with(
      'last_position',
      (db) => db
        .selectFrom("chargebot_gps_aggregate")
        .selectAll()
        .where('device_id', '=', bot_uuid)
        .where('vehicle_status', 'in', [VehicleStatus.AT_HOME, VehicleStatus.PARKED])
        .orderBy('max_timestamp', 'desc')
        .limit(1)
    )
    .selectFrom(['last_position as lp', 'chargebot_geocoding as geo'])
    .select([
      'lp.device_id',
      'lp.bucket as timestamp',
      'lp.vehicle_status',
      'lp.lat',
      'lp.lon',
      'lp.altitude',
      'lp.speed',
      'lp.bearing',
      'lp.distance',
      'geo.label as address',
      'geo.country',
      'geo.state',
      'geo.county',
      'geo.city',
      'geo.neighborhood',
      'geo.street',
      'geo.address_number',
      'geo.postal_code',
      'geo.place_id',
      'geo.timezone',
      'geo.timezone_offset',
    ])
    .where(sql`lp.lat = ANY(geo.latitudes)`)
    .where(sql`lp.lon = ANY(geo.longitudes)`)
    .limit(1)
    .executeTakeFirst();
}
