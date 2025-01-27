export * as Twilio from "./twilio";
import { Config } from "sst/node/config";
import Log from '@dazn/lambda-powertools-logger';
import { MessageInstance, MessageStatus } from "twilio/lib/rest/api/v2010/account/message";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const twilioClient = require("twilio")(Config.TWILIO_ACCOUNT_SSID, Config.TWILIO_AUTH_TOKEN);

// Function to get an existing user by email
export const sendSMS = async (message: string, to: string): Promise<{
  sid: string;
  status: MessageStatus
}> => {
  try {
    const response: MessageInstance = await twilioClient.messages.create({
      body: message,
      // from: Config.TWILIO_PHONE_NUMBER,
      messagingServiceSid: Config.TWILIO_SENDER_SERVICE,
      to
    });

    Log.info('SMS sent successfully:', {to, message, response});
    return {
      sid: response.sid,
      status: response.status,
    };
  } catch (error) {
    Log.error('Error sending SMS:', {error});
    throw error;
  }
}