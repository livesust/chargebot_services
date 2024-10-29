export * as ExpoPush from "./expo_push";
import Log from '@dazn/lambda-powertools-logger';
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { Config } from "sst/node/config";


export interface Notification {
  message?: string;
  title?: string;
  data?: object
}

export const send_push_notifications = async(tokens: string[], notification: Notification) => {
  const messages: ExpoPushMessage[] = [];

  const expo = new Expo({ accessToken: Config.EXPO_ACCESS_TOKEN });

  // Create the messages that we want to send to clients
  for (const token of tokens) {

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Push token ${token} is not a valid Expo push token`);
      continue;
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: token,
      sound: 'default',
      title: notification.title ?? 'ChargeBot',
      body: notification.message,
      data: notification.data,
    })
  }

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      Log.error("ERROR", { error });
      console.error(error);
    }
  }

  // TODO: Save the push info into a "notifications" table with the ticket id
  // this way we can create a CRON lambda function that periodically check against
  // expo server for the notification status
  // read https://github.com/expo/expo-server-sdk-node
  // once a notification is confirmed by expo server, we could remove from database, or remove after X days
}