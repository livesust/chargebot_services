import Log from '@dazn/lambda-powertools-logger';
import i18n from '../shared/i18n/i18n';
import { AwsDecrypt } from "@chargebot-services/core/services/aws/decrypt";
import { Twilio } from "@chargebot-services/core/services/twilio/twilio";
import type { CustomSMSSenderTriggerEvent } from 'aws-lambda';

export const main = async (event: CustomSMSSenderTriggerEvent) => {
  try {
    const { triggerSource } = event;
    const { code } = event.request;
    const { phone_number } = event.request.userAttributes;

    const decryptedCode = await AwsDecrypt.decryptCiphertext(code!);

    if (!decryptedCode) {
      throw Error("Can not decrypt SMS message");
    }

    let message = '';
    if (triggerSource === 'CustomSMSSender_AdminCreateUser') {
      const url = `${process.env.DEEP_LINK_URL}/activate?username=${encodeURIComponent(phone_number)}&password=${encodeURIComponent(decryptedCode)}`;
      message = `${i18n.__("email.admin_create_user.sms_message")} ${url}`;
    } else if (triggerSource === 'CustomSMSSender_ForgotPassword') {
      const url = `${process.env.DEEP_LINK_URL}/reset-password?username=${encodeURIComponent(phone_number)}&code=${encodeURIComponent(decryptedCode)}`;
      message = `${i18n.__("email.forgot_password.sms_message")} ${url}`;
    }

    const response = await Twilio.sendSMS(message, phone_number);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "SMS sent successfully",
        messageId: response.sid,
        status: response.status
      })
    };

  } catch (error) {
    Log.error('Error sending SMS:', {error});
    throw error;
  }
};