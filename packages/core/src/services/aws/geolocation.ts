export * as Geolocation from "./geolocation";
import { LocationClient, SearchPlaceIndexForPositionCommand } from "@aws-sdk/client-location"

const locationClient = new LocationClient({});

export interface Place {
  place_id: string | undefined;
  label: string | undefined;
  country: string | undefined;
  state: string | undefined;
  county: string | undefined;
  city: string | undefined;
  neighborhood: string | undefined;
  address_number: string | undefined;
  street: string | undefined;
  postal_code: string | undefined;
  timezone: string | undefined;
  timezone_offset: number | undefined;
}

// Function to get an existing user by email
export const getPlaceByPosition = async (lat: number, lon: number): Promise<Place | undefined> => {
  try {
    // Parameters for getting user by email
    // const [esriResponse, hereResponse] = await Promise.all([
    //   locationClient.send(new SearchPlaceIndexForPositionCommand({
    //     Position: [lon, lat],
    //     MaxResults: 1,
    //     IndexName: "ChargebotEsriPlaceIndex",
    //     Language: "en"
    //   })),
    //   locationClient.send(new SearchPlaceIndexForPositionCommand({
    //     Position: [lon, lat],
    //     MaxResults: 1,
    //     IndexName: "ChargebotHerePlaceIndex",
    //     Language: "en"
    //   }))
    // ]);

    // const esriResult = esriResponse?.Results ? esriResponse?.Results[0] : null;
    // const hereResult = hereResponse?.Results ? hereResponse?.Results[0] : null;

    // return {
    //   place_id: hereResult?.PlaceId ?? esriResult?.PlaceId,
    //   label: hereResult?.Place?.Label ?? esriResult?.Place?.Label,
    //   country: hereResult?.Place?.Country ?? esriResult?.Place?.Country,
    //   state: hereResult?.Place?.Region ?? esriResult?.Place?.Region,
    //   county: hereResult?.Place?.SubRegion ?? esriResult?.Place?.SubRegion,
    //   city: hereResult?.Place?.Municipality ?? esriResult?.Place?.Municipality,
    //   neighborhood: hereResult?.Place?.Neighborhood ?? esriResult?.Place?.Neighborhood,
    //   address_number: hereResult?.Place?.AddressNumber ?? esriResult?.Place?.AddressNumber,
    //   street: hereResult?.Place?.Street ?? esriResult?.Place?.Street,
    //   postal_code: hereResult?.Place?.PostalCode ?? esriResult?.Place?.PostalCode,
    //   timezone: hereResult?.Place?.TimeZone?.Name ?? esriResult?.Place?.TimeZone?.Name,
    //   timezone_offset: hereResult?.Place?.TimeZone?.Offset ?? esriResult?.Place?.TimeZone?.Offset,
    // };
    const hereResponse = await locationClient.send(new SearchPlaceIndexForPositionCommand({
      Position: [lon, lat],
      MaxResults: 1,
      IndexName: "ChargebotHerePlaceIndex",
      Language: "en"
    }));

    const hereResult = hereResponse?.Results ? hereResponse?.Results[0] : null;

    if (!hereResult) {
      return undefined;
    }

    return {
      place_id: hereResult.PlaceId,
      label: hereResult.Place?.Label,
      country: hereResult.Place?.Country,
      state: hereResult.Place?.Region,
      county: hereResult.Place?.SubRegion,
      city: hereResult.Place?.Municipality,
      neighborhood: hereResult.Place?.Neighborhood,
      address_number: hereResult.Place?.AddressNumber,
      street: hereResult.Place?.Street,
      postal_code: hereResult.Place?.PostalCode,
      timezone: hereResult.Place?.TimeZone?.Name,
      timezone_offset: hereResult.Place?.TimeZone?.Offset,
    };
  } catch (err) {
    console.info("Reverse Geocoding Error", err);
  }
}