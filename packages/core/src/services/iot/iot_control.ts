export * as IoTControl from "./iot_control";
import { IoTDataPlaneClient, PublishCommand } from "@aws-sdk/client-iot-data-plane";
import { Config } from "sst/node/config";

const client = new IoTDataPlaneClient({
  endpoint: `https://${Config.IOT_ENDPOINT}`
});

export async function sendCommand(bot_uuid: string, pdu_outlet_number: number, command: string): Promise<boolean> {
  const payload = JSON.stringify({
    "outlet_id": pdu_outlet_number,
    "command": command
  });

  const publishCommand = new PublishCommand({
    topic: `chargebot/control/${bot_uuid}/outlet`,
    payload: Buffer.from(payload),
    qos: 1
  })

  try {
    const response = await client.send(publishCommand);
    return response.$metadata.httpStatusCode === 200;
  } catch (err) {
    console.error('Error publishing message:', err);
    return false;
  }

}
