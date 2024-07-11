export * as ChargebotGps from "./chargebot_gps";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotGps, ChargebotGpsHistory, ChargebotGpsPosition, VehicleStatus } from "../../timescale/chargebot_gps";

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

export async function getLastPositionByBot(bot_uuid: string): Promise<ChargebotLocation | undefined> {
  const location: ChargebotGps | undefined = await db
  .selectFrom("chargebot_gps")
  .selectAll()
  .where('device_id', '=', bot_uuid)
  .orderBy('timestamp', 'desc')
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
      timestamp: location.timestamp,
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
        .selectFrom('chargebot_gps')
        // @ts-expect-error ignore overload not mapping
        .select([
          'id',
          'timestamp',
          'lat as latitude',
          'lon as longitude',
          'vehicle_status',
          sql`lag(vehicle_status) over (order by "timestamp") as prev_vehicle_status`,
          sql`lead(vehicle_status) over (order by "timestamp") as next_vehicle_status`,
          'distance'
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('timestamp', from, to))
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
        .selectFrom('chargebot_gps')
        // @ts-expect-error ignore overload not mapping
        .select([
          'id',
          'timestamp',
          'timezone',
          'lat as latitude',
          'lon as longitude',
          'distance',
          'vehicle_status',
          sql`lag(vehicle_status) over (order by "timestamp") as prev_vehicle_status`,
          sql`lead(vehicle_status) over (order by "timestamp") as next_vehicle_status`
        ])
        .where('device_id', '=', bot_uuid)
        .where((eb) => eb.between('timestamp', from, to))
        .orderBy('timestamp', 'asc')
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
          'id',
          'timestamp',
          'timezone',
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
        .selectFrom(['block_grouped', 'chargebot_geocoding'])
        .selectAll('chargebot_geocoding')
        .where(sql`block_grouped.latitude = ANY(chargebot_geocoding.latitudes)`)
        .where(sql`block_grouped.longitude = ANY(chargebot_geocoding.longitudes)`)
        .orderBy('timestamp', 'desc')
        .limit(1)
    )
    .selectFrom(['block_grouped', 'block_geocoding as geo'])
    // @ts-expect-error ignore
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
      'geo.label as address',
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
    .execute();
}

export async function getDaysWithData(bot_uuid: string, from: Date, to: Date): Promise<{
  bucket: Date,
  number_of_records: number
}[]> {
  const query = db
    .selectFrom("chargebot_gps")
    // @ts-expect-error ignore overload not mapping
    .select(({ fn }) => [
      sql`time_bucket_gapfill('1 day', "timestamp") AS bucket`,
      fn.count<number>('id').as('number_of_records'),
    ])
    .where('device_id', '=', bot_uuid)
    .where((eb) => eb.between('timestamp', from, to))
    .groupBy('bucket')
    .orderBy('bucket', 'asc');
  
  // @ts-expect-error not overloads match
  return query.execute();
}

async function getArrivedAtWhenAtHome(location: ChargebotGps) {
  // Vehicle is currently AT_HOME
  // We need to find the first AT_HOME in the current bucket of reports

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
        .selectFrom('chargebot_gps')
        // @ts-expect-error ignore overload not mapping
        .select([
          'timestamp',
          'vehicle_status',
          sql`
            ROW_NUMBER() OVER (ORDER BY timestamp DESC) -
            ROW_NUMBER() OVER (PARTITION BY vehicle_status ORDER BY "timestamp" DESC) AS block
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

async function getArrivedAtWhenParked(location: ChargebotGps) {
  // Vehicle is currently PARKED
  // We need to find the first report where vehicle is not PARKED
  // in the current bucket of reports
  return db
    .with(
      'vehicle_status_groups',
      (db) => db
        .selectFrom('chargebot_gps')
        // @ts-expect-error ignore overload not mapping
        .select([
          'timestamp',
          'vehicle_status',
          sql`ROW_NUMBER() OVER (ORDER BY timestamp DESC) - ROW_NUMBER() OVER (PARTITION BY vehicle_status ORDER BY "timestamp" DESC) AS block`
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

async function getLeftAtWhenInTransit(location: ChargebotGps) {
  // Vehicle is currently MOVING or STOPPED
  // We need to find the first MOVING in the current bucket of reports
  return db
    .with(
      'last_report_parked_home',
      // Get the last report where vehicle was PARKED/AT_HOME
      (db) => db
        .selectFrom('chargebot_gps')
        .select(({ fn }) => [
          fn.max('chargebot_gps.timestamp').as('timestamp'),
        ])
        .where('device_id', '=', location.device_id)
        .where('vehicle_status', 'in', [VehicleStatus.AT_HOME, VehicleStatus.PARKED])
        .where('timestamp', '<', location.timestamp)
    )
    // Now get the first MOVING report after being PARKED/AT_HOME
    .selectFrom(['chargebot_gps', 'last_report_parked_home'])
    .select(({ fn }) => [
      fn.min('chargebot_gps.timestamp').as('timestamp'),
    ])
    .where('chargebot_gps.device_id', '=', location.device_id)
    .where('chargebot_gps.vehicle_status', '=', VehicleStatus.MOVING)
    .where(sql`chargebot_gps.timestamp > last_report_parked_home.timestamp`)
    .executeTakeFirst();
}

async function getLastParkedAtHomePosition(bot_uuid: string): Promise<ChargebotLocation | undefined> {
  // @ts-expect-error ignore overload not mapping
  return db
    .with(
      'last_position',
      (db) => db
        .selectFrom("chargebot_gps")
        .selectAll()
        .where('device_id', '=', bot_uuid)
        .where('vehicle_status', 'in', [VehicleStatus.AT_HOME, VehicleStatus.PARKED])
        .orderBy('timestamp', 'desc')
        .limit(1)
    )
    .selectFrom(['last_position as lp', 'chargebot_geocoding as geo'])
    .select([
      'lp.device_id',
      'lp.timestamp',
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
