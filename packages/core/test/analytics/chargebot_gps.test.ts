import { beforeAll, afterAll, describe, expect, it } from "vitest";
import db from "@chargebot-services/core/src/api";
import { faker } from '@faker-js/faker';
import { ChargebotGps as ChargebotGpsEntity, VehicleStatus } from "@chargebot-services/core/src/api/chargebot_gps";
import { ChargebotGps } from "@chargebot-services/core/src/services/analytics/chargebot_gps";
import { DateTime } from "luxon";

const NUMBER_OF_LOCATIONS = 100;
const bot_uuid = 'unit_test';
const maxTimestamp = DateTime.utc(2020, 1, 1, 20);
const minTimestamp = DateTime.utc(2020, 1, 1, 20).minus({second: NUMBER_OF_LOCATIONS * 5});
let totalDistance = 0;
const locations: ChargebotGpsEntity[] = [];

describe('Chargebot GPS Tests', () => {

  beforeAll(async () => {
    const array: ChargebotGpsEntity[] = [];
    for (let i = 0; i < NUMBER_OF_LOCATIONS; i++) {
      const speed = faker.number.float({ min: 0, max: 120, precision: 2 });

      const data = {
        device_id: bot_uuid,
        timestamp: maxTimestamp.minus({ second: i * 5 }).toJSDate(),
        timezone: maxTimestamp.zone.name,
        lat: faker.location.latitude(),
        lon: faker.location.longitude(),
        altitude: faker.number.float({ min: 100, max: 1000, precision: 2 }),
        speed: i <= 10 || i >= 90 || (i >= 50 && i <= 75) ? 0 : speed,
        bearing: faker.number.float({ min: 1, max: 360, precision: 2 }),
        distance: 0,
        vehicle_status: i <= 10 || i >= 90
          ? VehicleStatus.AT_HOME
          : (i >= 50 && i <= 75 ? VehicleStatus.PARKED : VehicleStatus.MOVING),
        lat_unit: 'deg',
        lon_unit: 'deg',
        altitude_unit: 'meters',
        speed_unit: 'kmh',
        bearing_unit: 'deg',
        quality: faker.number.float({ min: 1, max: 100, precision: 2 }),
        nav_mode: '3D',
      };

      if (data.vehicle_status == VehicleStatus.MOVING) {
        data.distance = faker.number.float({ min: 1, max: 100, precision: 2 });
        totalDistance += data.distance;
      }

      if (i > 0 && (data.vehicle_status == VehicleStatus.AT_HOME || VehicleStatus.PARKED)) {
        data.lat = array[i - 1].lat;
        data.lon = array[i - 1].lon;
      }
      // @ts-expect-error ignore typing error
      array.push(data);
    }

    locations.push(
      // @ts-expect-error ignore typing error
      await db
        .insertInto('chargebot_gps')
        .values(array)
        .returningAll()
        .execute()
    );
  })

  afterAll(async () => {
    await db
      .deleteFrom('chargebot_gps')
      .where('device_id', '=', bot_uuid)
      .executeTakeFirst();
  })

  it("getLastPositionByBot", async () => {
    const location = await ChargebotGps.getLastPositionByBot(bot_uuid);
    expect(location).toBeDefined();
    expect(location?.timestamp).toEqual(maxTimestamp.toJSDate());
  });

  it("getRouteByBot", async () => {
    const locations = await ChargebotGps.getRouteByBot(bot_uuid, minTimestamp.toJSDate(), maxTimestamp.toJSDate());
    expect(locations).toBeDefined();
    expect(locations).toHaveLength(NUMBER_OF_LOCATIONS);
    locations?.forEach(location => expect(['AT_HOME', 'ON_LOCATION', 'IN_TRANSIT']).toContain(location.vehicle_status));
  });

  it("getSummaryByBot", async () => {
    const locations = await ChargebotGps.getSummaryByBot(bot_uuid, minTimestamp.toJSDate(), maxTimestamp.toJSDate());
    expect(locations).toBeDefined();
    // we expect to have 5 groups of data in the summary
    // AT_HOME: 2 groups, records 0-10 and 90-100 (AT_HOME)
    // IN_TRANSIT: 2 groups, records 10-50 and 75-90 (MOVING)
    // AT_LOCATION: 1 group, records 50 to 75 (PARKED)

    expect(locations).toHaveLength(5);
    locations?.forEach(location => expect(['AT_HOME', 'ON_LOCATION', 'IN_TRANSIT']).toContain(location.vehicle_status));
    locations?.filter(l => l.vehicle_status === 'AT_HOME').forEach(location => expect(location.distance).toBe(0));
    locations?.filter(l => l.vehicle_status === 'ON_LOCATION').forEach(location => expect(location.distance).toBe(0));
    const accDistance = locations?.filter(l => l.vehicle_status === 'IN_TRANSIT').reduce((sum, current) => sum + current.distance, 0);
    expect(accDistance).toBe(totalDistance)
  });

  it("getDaysWithData", async () => {
    const locations = await ChargebotGps.getDaysWithData(bot_uuid, DateTime.utc(2019, 12, 31).toJSDate(), DateTime.utc(2020, 1, 2).toJSDate());
    expect(locations).toBeDefined();
    expect(locations).toHaveLength(3);
    expect(locations[0].number_of_records).toBe(null);
    expect(+locations[1].number_of_records).toBe(NUMBER_OF_LOCATIONS);
    expect(locations[2].number_of_records).toBe(null);
  });
});
