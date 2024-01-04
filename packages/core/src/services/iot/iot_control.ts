export * as IoTControl from "./iot_control";
import AWS from "aws-sdk";
import { Config } from "sst/node/config";

const iotdata = new AWS.IotData({ endpoint: Config.IOT_ENDPOINT });

export async function sendCommand(bot_uuid: string, pdu_outlet_number: number, command: string): Promise<boolean> {
  const params = {
    topic: `chargebot/control/${bot_uuid}/outlet`,
    payload: JSON.stringify({
      "outlet_id": pdu_outlet_number,
      "command": command
    }),
    qos: 1
  };

  try {
    await iotdata.publish(params).promise();
    return true;
  } catch (err) {
    console.error('Error publishing message:', err);
    return false;
  }

}
