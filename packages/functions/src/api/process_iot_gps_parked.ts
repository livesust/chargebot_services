import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpEventNormalizer from '@middy/http-event-normalizer';
import executionTimeLogger from '../shared/middlewares/time-log';
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { ChargebotGeocoding } from "@chargebot-services/core/services/analytics/chargebot_geocoding";
import { Geolocation, Place } from "@chargebot-services/core/services/aws/geolocation";
import { SearchForPositionResult, SearchPlaceIndexForPositionResponse } from "@aws-sdk/client-location"

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  // {
  //   device_id: 'm2SaLHD',
  //   device_version: '0.5.2',
  //   timestamp: 1718386732656,
  //   timezone: 'Etc/UTC',
  //   lat: 39.151867,
  //   lat_unit: 'deg',
  //   lon: -77.099594,
  //   lon_unit: 'deg',
  //   altitude: 490.81366,
  //   altitude_unit: 'ft',
  //   speed: 0,
  //   speed_unit: 'mph',
  //   bearing: 277.72406,
  //   bearing_unit: 'deg',
  //   distance: 0,
  //   distance_unit: 'mi',
  //   vehicle_status: 'AT_HOME',
  //   quality: 1,
  //   nav_mode: '2D',
  //   error: ''
  // }
  const gpsLocation = event.body?.value ?? event.value;
  console.log('GPS Parked Report', gpsLocation.lat, gpsLocation.lon);

  // search for an existent geocoding entry for lat/lon
  const exists = await ChargebotGeocoding.getByLatLon(gpsLocation.lat, gpsLocation.lon);

  if (exists) {
    console.log('GPS Position already geocoded');
    return;
  }

  // geocoding entry does not exist
  // execute a reverse geocoding
  const place: Place | undefined = await Geolocation.getPlaceByPosition(gpsLocation.lat, gpsLocation.lon);
  if (!place) {
    console.log('GPS Reverse Geocoding not found');
    return;
  }
  
  // search for an existent entry for the same place id or label
  const geocoding = await (place.place_id
    ? ChargebotGeocoding.getByPlaceId(place.place_id)
    : ChargebotGeocoding.getByLabel(place.label!)
  )

  if (geocoding) {
    // append GPS lat/long to current geocoding place id
    geocoding.latitudes = geocoding.latitudes ? [...geocoding.latitudes, gpsLocation.lat] : [gpsLocation.lat];
    geocoding.longitudes = geocoding.longitudes ? [...geocoding.longitudes, gpsLocation.lon] : [gpsLocation.lon];
    await ChargebotGeocoding.update(geocoding.id, geocoding);
    console.log('GPS Reverse Geocoding Updated lats/lons');
  } else {
    // create new geocoding for the lat/lon and place id
    await ChargebotGeocoding.create({
      timestamp: new Date(),
      latitudes: [gpsLocation.lat],
      longitudes: [gpsLocation.lon],
      label: place.label,
      country: place.country,
      state: place.state,
      county: place.county,
      city: place.city,
      neighborhood: place.neighborhood,
      address_number: place.address_number,
      street: place.street,
      postal_code: place.postal_code,
      place_id: place.place_id,
      timezone: place.timezone,
      timezone_offset: place.timezone_offset,
    })
    console.log('GPS Reverse Geocoding Created');
  }
};

export const main = middy(handler)
  // before
  .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(jsonBodyParser({ reviver: dateReviver }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());