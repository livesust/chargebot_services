export * as ChargebotGeocoding from "./chargebot_geocoding";
import { sql } from "kysely";
import db from '../../timescale';
import { ChargebotGeocoding, ChargebotGeocodingTableUpdate, NewChargebotGeocodingTable } from "../../timescale/chargebot_geocoding";

export async function create(geocoding: NewChargebotGeocodingTable): Promise<ChargebotGeocoding | undefined> {
    return await db
        .insertInto('chargebot_geocoding')
        .values(geocoding)
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, geocoding: ChargebotGeocodingTableUpdate): Promise<ChargebotGeocoding | undefined> {
    return await db
        .updateTable('chargebot_geocoding')
        .set(geocoding)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();
}

export async function exists(lat: number, lon: number): Promise<boolean> {
  const count: { value: number; } | undefined = await db
    .selectFrom("chargebot_geocoding")
    .select(({ fn }) => [
      fn.count<number>('chargebot_geocoding.id').as('value'),
    ])
    .where(sql`array_position(latitudes, ${lat}) IS NOT NULL`)
    .where(sql`array_position(longitudes, ${lon}) IS NOT NULL`)
    .executeTakeFirst();
  return (count && count.value > 0) ?? false;
}

export async function addLatLong(id: number, lat: number, lon: number): Promise<ChargebotGeocoding | undefined> {
    return await db
        .updateTable('chargebot_geocoding')
        .set({
          latitudes: sql`CASE 
              WHEN array_position(latitudes, ${lat}) IS NULL THEN 
                  COALESCE(latitudes, ARRAY[]::float4[])::float4[] || ARRAY[${lat}]::float4[]
              ELSE latitudes
          END`,
          longitudes: sql`CASE 
            WHEN array_position(longitudes, ${lat}) IS NULL THEN 
                COALESCE(longitudes, ARRAY[]::float4[])::float4[] || ARRAY[${lon}]::float4[]
            ELSE longitudes
          END`
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();
}

export async function removeLatLong(id: number, lat: number, lon: number): Promise<ChargebotGeocoding | undefined> {
    return await db
        .updateTable('chargebot_geocoding')
        // @ts-expect-error not overloads match
        .set(() => ({
          latitudes: sql`array_remove(latitudes, ${lat})`,
          longitudes: sql`array_remove(longitudes, ${lon})`
        }))
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();
}

export async function getByLatLon(lat: number, lon: number): Promise<ChargebotGeocoding | undefined> {
  const location: ChargebotGeocoding | undefined = await db
    .selectFrom("chargebot_geocoding")
    .selectAll()
    .where(sql`array_position(latitudes, ${lat}) IS NOT NULL`)
    .where(sql`array_position(longitudes, ${lon}) IS NOT NULL`)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();

  return location;
}

export async function getByPlaceId(placeId: string): Promise<ChargebotGeocoding | undefined> {
  const location: ChargebotGeocoding | undefined = await db
    .selectFrom("chargebot_geocoding")
    .selectAll()
    .where('place_id', '=', placeId)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();

  return location;
}

export async function getByLabel(label: string): Promise<ChargebotGeocoding | undefined> {
  const location: ChargebotGeocoding | undefined = await db
    .selectFrom("chargebot_geocoding")
    .selectAll()
    .where('label', '=', label)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst();

  return location;
}
