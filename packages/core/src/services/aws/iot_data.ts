export * as IoTData from "./iot_data";
import { IoTDataPlaneClient, PublishCommand, GetThingShadowCommand, UpdateThingShadowCommand } from "@aws-sdk/client-iot-data-plane";
import { Config } from "sst/node/config";
import { IoTShadow } from "../../iot/iot_shadow";

const client = new IoTDataPlaneClient({
  endpoint: `https://${Config.IOT_ENDPOINT}`
});

export const publish = async(topic: string, payload: unknown): Promise<boolean> => {
  const publishCommand = new PublishCommand({
    topic,
    payload: Buffer.from(JSON.stringify(payload)),
    qos: 1
  })

  try {
    console.log("Publishing to IoT: ", topic);
    const response = await client.send(publishCommand);
    return response.$metadata.httpStatusCode === 200;
  } catch (err) {
    console.error('Error publishing to IoT:', topic, err);
    return false;
  }
}

export async function getShadowStatus(bot_uuid: string, shadow_name: string): Promise<IoTShadow | undefined> {
  const getThingShadowCommand = new GetThingShadowCommand({
    thingName: bot_uuid,
    shadowName: shadow_name
  })

  try {
    console.log("Get Shadow from IoT: " + bot_uuid);
    const response = await client.send(getThingShadowCommand);
    if (response.$metadata.httpStatusCode === 200 && response.payload) {
      const shadow: IoTShadow = JSON.parse(Buffer.from(response.payload).toString())
      return shadow;
    }
  } catch (err) {
    console.error('Error getting IoT Shadow:', bot_uuid, shadow_name, err);
  }
}

export async function updateShadowStatus(bot_uuid: string, shadow_name: string, payload: unknown): Promise<IoTShadow | undefined> {
  const getThingShadowCommand = new UpdateThingShadowCommand({
    thingName: bot_uuid,
    shadowName: shadow_name,
    payload: Buffer.from(JSON.stringify(payload)),
  });

  try {
    console.log("Update Shadow to IoT: " + bot_uuid);
    const response = await client.send(getThingShadowCommand);
    if (response.$metadata.httpStatusCode === 200 && response.payload) {
      const shadow: IoTShadow = JSON.parse(Buffer.from(response.payload).toString())
      return shadow;
    }
  } catch (err) {
    console.error('Error updating IoT Shadow:', bot_uuid, shadow_name, err);
  }
}