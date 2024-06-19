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

export async function getByLatLon(lat: number, lon: number): Promise<ChargebotGeocoding | undefined> {
  const location: ChargebotGeocoding | undefined = await db
    .selectFrom("chargebot_geocoding")
    .selectAll()
    .where(sql`${lat} = ANY(latitudes)`)
    .where(sql`${lon} = ANY(longitudes)`)
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
