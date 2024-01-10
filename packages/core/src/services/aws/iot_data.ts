export * as IoTData from "./iot_data";
import { IoTDataPlaneClient, PublishCommand } from "@aws-sdk/client-iot-data-plane";
import { Config } from "sst/node/config";

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
