export * as IoTShadow from "./iot_shadow";
import axios from 'axios';
import { Config } from "sst/node/config";
import { IoTShadow } from "../../iot/iot_shadow";

export async function getSystemStatus(bot_uuid: string): Promise<IoTShadow | undefined> {
  const url = Config.IOT_API_URL;
  const headers = { 'x-api-key': Config.IOT_API_KEY };
  const response = await axios.get(
    `${url}/shadow/status?device_id=${bot_uuid}&shadow_name=system`,
    { headers }
  );
  return response.data;
}
