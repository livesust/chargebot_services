import { StackContext, EventBus, use } from "sst/constructs";
import { RDSStack } from "./RDSStack";
import { IotStack } from "./IotStack";
import { CognitoStack } from "./CognitoStack";

export function EventBusStack({ app, stack }: StackContext) {
  const { rdsCluster } = use(RDSStack);
  const { iotRole, IOT_ENDPOINT } = use(IotStack);
  const { cognitoAdminRole, COGNITO_USER_POOL_ID } = use(CognitoStack);

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
      },
      bot_deleted: {
        pattern: {
          source: ["deleted"],
          detailType: ["bot"],
        },
        targets: {
          on_bot_created: {
            function: {
              handler: "packages/functions/src/events/on_bot_deleted.main",
              timeout,
              bind: [rdsCluster],
            }
          },
        },
      },
      outlet_equipment: {
        pattern: {
          source: ["deleted"],
          detailType: ["outlet", "equipment"],
        },
        targets: {
          on_outlet_or_equipment_deleted: {
            function: {
              handler: "packages/functions/src/events/on_outlet_or_equipment_deleted.main",
              timeout,
              bind: [rdsCluster],
            }
          },
        },
      },
      on_permission_modified: {
        pattern: {
          source: ["created", "deleted"],
          detailType: ["permission"],
        },
        targets: {
          on_bot_created: {
            function: {
              handler: "packages/functions/src/events/on_permission_modified.main",
              timeout,
              bind: [rdsCluster],
            }
          },
        },
      },
      scheduled_alert_created: {
        pattern: {
          source: ["created"],
          detailType: ["scheduled_alert"],
        },
        targets: {
          on_scheduled_alert_created: {
            function: {
              handler: "packages/functions/src/events/on_scheduled_alert_created.main",
              timeout,
              bind: [rdsCluster],
            }
          },
        },
      },
      on_user_deleted: {
        pattern: {
          source: ["deleted"],
          detailType: ["user"],
        },
        targets: {
          on_bot_created: {
            function: {
              handler: "packages/functions/src/events/on_user_deleted.main",
              timeout,
              bind: [rdsCluster, COGNITO_USER_POOL_ID],
              // @ts-expect-error ignore check
              role: cognitoAdminRole,
            }
          },
        },
      },
    },
  });

  return {
    eventBus,
  };
}
