import { StackContext, EventBus, use } from "sst/constructs";
import { RDSStack } from "./RDSStack";
import { IotStack } from "./IotStack";

export function EventBusStack({ app, stack }: StackContext) {
  const { rdsCluster } = use(RDSStack);
  const { iotRole, IOT_ENDPOINT } = use(IotStack);

  const timeout = app.stage === "prod" ? "10 seconds" : "30 seconds";

  const eventBus = new EventBus(stack, "api", {
    rules: {
      outlet_schedule: {
        pattern: {
          source: ["created", "updated", "deleted"],
          detailType: ["outlet_schedule"],
        },
        targets: {
          publish_outlet_schedule: {
            function: {
              handler: "packages/functions/src/events/publish_event.main",
              timeout,
              // @ts-expect-error ignore check
              role: iotRole,
              bind: [IOT_ENDPOINT]
            }
          },
        },
      },
      bot_created: {
        pattern: {
          source: ["created"],
          detailType: ["bot"],
        },
        targets: {
          on_bot_created: {
            function: {
              handler: "packages/functions/src/events/on_bot_created.main",
              timeout,
              bind: [rdsCluster],
            }
          },
        },
      }
    },
  });

  return {
    eventBus,
  };
}
