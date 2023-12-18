/*{
  "id": 133,
  "bot_uuid": "85ab4178-5971-11ee-a3db-033507a860c9",
  "initials": "SB",
  "name": "Samit's Bot",
  "pin_color": "yellow",
  "energy": {
    "source": array_string("GRID", "SOLAR", "BOTH", "OFF"),
    "destination": array_string("OUTPUT", "BATTERY", "BOTH", "OFF"),
    "grid_amps": 15,
    "solar_watts": 300,
    "output_amps": 13,
    "battery_level": 48,
    "battery_status": string("CHARGING", "DISCHARGING", "IDLE")
  },
  "location": {
    "state": string("AT_HOME", "IN_TRANSIT", "ON_LOCATION")
    "latitude": 39.151825,
    "longitude": -77.099670,
    "arrived_at": "2023-12-04T16:25:56Z",
    "left_at": "2023-12-04T16:32:58Z",
  },
  "today_usage": {
    "total_kwh": 14.9,
    "charging_kw": 8.1
  },
  "outlets": [
    {
      "id": 100,
      "outlet_number": 1,
      "state": string("ON", "OFF"),
      "last_on": "2023-12-04T18:32:58Z",
      "last_off": "2023-12-04T16:32:58Z"
    }
  ]
}*/
import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError } from '@middy/util';
import httpErrorHandler from "@middy/http-error-handler";
import { BotUUIDPathParamSchema } from "../shared/schemas";
import { ArrayResponseSchema } from "../schemas/chargebot_gps.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { ChargebotGps } from "@chargebot-services/core/services/chargebot_gps";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
    const bot_uuid = event.pathParameters!.bot_uuid!;

    let records;

    try {
        records = await ChargebotGps.getByBot(bot_uuid);
    } catch (error) {
        const httpError = createError(500, "cannot query chargebot gps positions ", { expose: true });
        httpError.details = (<Error>error).message;
        throw httpError;
    }

    return createSuccessResponse(records);
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(validator({ pathParametersSchema: BotUUIDPathParamSchema }))
    // after: inverse order execution
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: ArrayResponseSchema }))
    // httpErrorHandler must be the last error handler attached, first to execute.
    // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
    .use(httpErrorHandler());