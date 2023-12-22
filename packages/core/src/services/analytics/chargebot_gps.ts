export * as ChargebotGps from "./chargebot_gps";
import { sql } from "kysely";
import db from '../../api';
import { ChargebotGps, ChargebotGpsHistory, ChargebotGpsPosition, VehicleStatus } from "../../api/chargebot_gps";

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

export async function getLastPositionByBot(bot_uuid: string): Promise<ChargebotGps | undefined> {
  const location: ChargebotGps | undefined = await db
    .selectFrom("chargebot_gps")
    .selectAll()
    .where('device_id', '=', bot_uuid)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();
  if (location) {
    let arrived_at = undefined;
    if (location.vehicle_status === VehicleStatus.AT_HOME) {
      arrived_at = await getArrivedAtWhenAtHome(location);
    }
    if (location.vehicle_status === VehicleStatus.PARKED) {
      arrived_at = await getArrivedAtWhenParked(location);
    }
    location.arrived_at = arrived_at?.timestamp ?? undefined;


    let left_at = undefined;
    if (location.vehicle_status === VehicleStatus.MOVING || location.vehicle_status === VehicleStatus.STOPPED) {
      left_at = await getLeftAtWhenInTransit(location);
    }
    location.left_at = left_at?.timestamp ?? undefined;
  }

  return location;
}

export async function getRouteByBot(bot_uuid: string, from: Date, to: Date): Promise<ChargebotGpsPosition[] | undefined> {
  // @ts-expect-error ignore overload not mapping
  return await db
    .selectFrom('chargebot_gps')
    .select([
      'timestamp',
      'lat as latitude',
      'lon as longitude',
      sql`
        case
          when vehicle_status = 'AT_HOME' then 'AT_HOME'
          when vehicle_status = 'PARKED' then 'ON_LOCATION'
          when vehicle_status in ('MOVING', 'STOPPED') then 'IN_TRANSIT'
        end as vehicle_status
      `
    ])
    .where('device_id', '=', bot_uuid)
    .where('timestamp', '>=', from)
    .where('timestamp', '<=', to)
    .orderBy('timestamp', 'desc')
    .execute();
}

export async function getSummaryByBot(bot_uuid: string, from: Date, to: Date): Promise<ChargebotGpsHistory[] | undefined> {
  // @ts-expect-error ignore overload not mapping
  return await db
    .with(
      'block_status',
      // @ts-expect-error ignore overload not mapping
      (db) => db
        // Get the gps locations for bot between from and to
        // translate vehicle status in query
        // order from recent to oldest
        .selectFrom('chargebot_gps')
        .select([
          'timestamp',
          'lat as latitude',
          'lon as longitude',
          'distance',
          sql`
            case
              when vehicle_status = 'AT_HOME' then 'AT_HOME'
              when vehicle_status = 'PARKED' then 'ON_LOCATION'
              when vehicle_status in ('MOVING', 'STOPPED') then 'IN_TRANSIT'
            end as vehicle_status
          `
        ])
        .where('device_id', '=', bot_uuid)
        .where('timestamp', '>=', from)
        .where('timestamp', '<=', to)
        .orderBy('timestamp', 'desc')
    )
    .with(
      'block_groups',
      (db) => db
        // group the gps positions
        // in blocks of vehicle status with subgroups by day
        // that way if vehicle was AT_HOME since yesterday 9pm
        // to today 8am, it will be 2 blocks:
        //    records at AT_HOME between yesterday 9pm to 11:59pm
        //    records AT_HOME between today 0am to 8am
        .selectFrom('block_status')
        .select([
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
    .select(({ fn }) => [
      // get the values by block groups
      fn.min('timestamp').as('arrived_at'),
      fn.max('timestamp').as('left_at'),
      fn.max('latitude').as('latitude'),
      fn.max('longitude').as('longitude'),
      fn.sum('distance').as('distance'),
      'vehicle_status'
    ])
    .groupBy(['block', 'vehicle_status'])
    .orderBy('arrived_at', 'desc')
    .execute();
}

async function getArrivedAtWhenAtHome(location: ChargebotGps) {
  // Vehicle is currently AT_HOME
  // We need to find the first AT_HOME in the current bucket of reports

  // Get the last report where vehicle was not AT_HOME
  /*
  WITH block_groups AS (
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
  return await db
    .with(
      'vehicle_status_groups',
      // @ts-expect-error ignore overload not mapping
      (db) => db
        .selectFrom('chargebot_gps')
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
  return await db
    .with(
      'vehicle_status_groups',
      // @ts-expect-error ignore overload not mapping
      (db) => db
        .selectFrom('chargebot_gps')
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

  // Get the last report where vehicle was PARKED/AT_HOME
  const prev = await db
    .selectFrom('chargebot_gps')
    .select(({ fn }) => [
      fn.max('chargebot_gps.timestamp').as('timestamp'),
    ])
    .where('device_id', '=', location.device_id)
    .where('vehicle_status', 'in', [VehicleStatus.AT_HOME, VehicleStatus.PARKED])
    .where('timestamp', '<', location.timestamp)
    .executeTakeFirst();

  if (prev) {
    // Now get the first MOVING report after being PARKED/AT_HOME
    return await db
      .selectFrom('chargebot_gps')
      .select(({ fn }) => [
        fn.min('chargebot_gps.timestamp').as('timestamp'),
      ])
      .where('device_id', '=', location.device_id)
      .where('vehicle_status', '=', VehicleStatus.MOVING)
      .where('timestamp', '>', prev.timestamp)
      .executeTakeFirst();
  }
}