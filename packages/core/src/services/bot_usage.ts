export * as ChargebotGps from "./chargebot_gps";
import db from '../api';
import { ChargebotGps } from "../api/chargebot_gps";

export enum VehicleStatus {
  AT_HOME = 'AT_HOME',
  MOVING = 'MOVING',
  STOPPED = 'STOPPED',
  PARKED = 'PARKED',
}

export function translateVehicleStatus(vehicle_status: VehicleStatus | string | undefined): string | undefined {
  if (!vehicle_status) {
    return undefined;
  }

  return vehicle_status == VehicleStatus.PARKED
    ? 'AT_LOCATION'
    : (
      vehicle_status == VehicleStatus.MOVING || vehicle_status == VehicleStatus.STOPPED
        ? 'IN_TRANSIT'
        : VehicleStatus.AT_HOME
    );
}

export async function getByBot(bot_uuid: string): Promise<ChargebotGps | undefined> {
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

async function getArrivedAtWhenAtHome(location: ChargebotGps) {
  // Vehicle is currently AT_HOME
  // We need to find the first AT_HOME in the current bucket of reports

  // Get the last report where vehicle was not AT_HOME
  const prev = await db
    .selectFrom('chargebot_gps')
    .select(({ fn }) => [
      fn.max('chargebot_gps.timestamp').as('timestamp'),
    ])
    .where('device_id', '=', location.device_id)
    .where('vehicle_status', 'in', [VehicleStatus.MOVING, VehicleStatus.STOPPED, VehicleStatus.PARKED])
    .where('timestamp', '<', location.timestamp)
    .executeTakeFirst();

  if (prev) {
    // Get the first AT_HOME report in the current bucket of AT_HOME reports
    return await db
      .selectFrom('chargebot_gps')
      .select(({ fn }) => [
        fn.min('chargebot_gps.timestamp').as('timestamp'),
      ])
      .where('device_id', '=', location.device_id)
      .where('vehicle_status', '=', VehicleStatus.AT_HOME)
      .where('timestamp', '>', prev.timestamp)
      .executeTakeFirst();
  }
}

async function getArrivedAtWhenParked(location: ChargebotGps) {
  // Vehicle is currently PARKED
  // We need to find the first report where vehicle is not PARKED
  // in the current bucket of reports
  return await db
    .selectFrom('chargebot_gps')
    .select(({ fn }) => [
      fn.max('chargebot_gps.timestamp').as('timestamp'),
    ])
    .where('device_id', '=', location.device_id)
    .where('vehicle_status', '!=', VehicleStatus.PARKED)
    .where('timestamp', '<', location.timestamp)
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