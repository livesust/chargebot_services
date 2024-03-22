export * as EventBus from "./event_bus";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { EventBus } from "sst/node/event-bus";

const client = new EventBridgeClient();

export const dispatchEvent = async (entity_name: string, event: string, detail: unknown) => {
  const command = new PutEventsCommand({
    Entries: [
      {
        EventBusName: EventBus.api.eventBusName,
        Source: event,
        DetailType: entity_name,
        Detail: JSON.stringify(detail),
      },
    ],
  });

  try {
    console.log("Publishing to EventBus: ", event, entity_name);
    const response = await client.send(command);
    return response.$metadata.httpStatusCode === 200;
  } catch (err) {
    console.error('Error publishing to EventBus:', event, entity_name, err);
    return false;
  }
}
