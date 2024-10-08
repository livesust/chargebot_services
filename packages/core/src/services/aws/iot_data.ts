export * as IoTData from "./iot_data";
import { IoTDataPlaneClient, PublishCommand, GetThingShadowCommand, GetThingShadowCommandOutput, UpdateThingShadowCommand, UpdateThingShadowCommandOutput } from "@aws-sdk/client-iot-data-plane";
import { Config } from "sst/node/config";
import { IoTShadow } from "../../iot/iot_shadow";
import Log from '@dazn/lambda-powertools-logger';

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
    Log.info("Publishing to IoT", {topic});
    const response = await client.send(publishCommand);
    return response.$metadata.httpStatusCode === 200;
  } catch (err) {
    Log.error('Error publishing to IoT', {topic, err});
    return false;
  }
}

export async function getShadowStatus(bot_uuid: string, shadow_name: string): Promise<IoTShadow | undefined> {
  const getThingShadowCommand = new GetThingShadowCommand({
    thingName: bot_uuid,
    shadowName: shadow_name
  })

  try {
    Log.info("Get Shadow from IoT", {shadow_name, bot_uuid});
    const response: GetThingShadowCommandOutput = await client.send(getThingShadowCommand);
    if (response.$metadata.httpStatusCode === 200 && response.payload) {
      const shadow: IoTShadow = JSON.parse(Buffer.from(response.payload).toString())
      return shadow;
    }
  } catch (err) {
    Log.error('Error getting IoT Shadow', {bot_uuid, shadow_name, err});
  }
}

export async function updateShadowStatus(bot_uuid: string, shadow_name: string, payload: unknown): Promise<IoTShadow | undefined> {
  const updateThingShadowCommand = new UpdateThingShadowCommand({
    thingName: bot_uuid,
    shadowName: shadow_name,
    payload: Buffer.from(JSON.stringify({
      state: {
        desired: payload
      }
    })),
  });

  try {
    Log.info("Update Shadow to IoT", {shadow_name, bot_uuid});
    const response: UpdateThingShadowCommandOutput = await client.send(updateThingShadowCommand);
    if (response.$metadata.httpStatusCode === 200 && response.payload) {
      const shadow: IoTShadow = JSON.parse(Buffer.from(response.payload).toString())
      return shadow;
    }
  } catch (err) {
    Log.error('Error updating IoT Shadow', {bot_uuid, shadow_name, err});
  }
}