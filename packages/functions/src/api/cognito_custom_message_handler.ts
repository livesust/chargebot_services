import Log from '@dazn/lambda-powertools-logger';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import fs from "fs-extra";
import i18n from '../shared/i18n/i18n';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to load and customize the HTML template
const loadEmailTemplate = async (templateName: string, replacements?: object) => {
  const templatePath = `../shared/templates/${templateName}.html`;
  let template = await fs.readFile(resolve(__dirname, templatePath), "utf-8");

  // Replace placeholders in the template with actual values
  if (replacements) {
    for (const [key, value] of Object.entries(replacements)) {
      template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
  }

  return template;
};

// @ts-expect-error ignore any type for event
export const main = async (event) => {
  // const { codeParameter } = event.request;
  const { email, phone_number } = event.request.userAttributes;
  const invitation_method = event.request.userAttributes['custom:invitationMethod'];
  const username = (invitation_method === 'phone_number' && phone_number && (phone_number as string).length > 0) ? phone_number : email;

  try {
    if (event.triggerSource === "CustomMessage_AdminCreateUser") {
      // Handle sign-up custom messages
      const url = `${process.env.DEEP_LINK_URL}/activate?username=${encodeURIComponent(username)}&password={####}`;

      if (phone_number && (phone_number as string).length > 0) {
        event.response.smsMessage = `${i18n.__("email.admin_create_user.sms_message")} ${url}`;
        Log.info('Sending SMS: ', {smsMessage: event.response.smsMessage});
      }

      if (email && (email as string).length > 0) {
        const emailHtml = await loadEmailTemplate("admin-create-user-email", {
          i18n_text: i18n.__("email.admin_create_user.text"),
          i18n_username: i18n.__("email.admin_create_user.username"),
          i18n_password: i18n.__("email.admin_create_user.password"),
          i18n_button: i18n.__("email.admin_create_user.button"),
          i18n_get_app: i18n.__("email.admin_create_user.get_app"),
          i18n_need_help: i18n.__("email.admin_create_user.need_help"),
          i18n_sign: i18n.__("email.admin_create_user.sign"),
          i18n_footer: i18n.__("email.admin_create_user.footer"),
          cognito_username: email?.length > 0 && phone_number?.length > 0
            ? i18n.__("email.admin_create_user.email_or_phone", {email, phone_number})
            : (email?.length > 0 ? email : phone_number),
          buttonUrl: url,
        });
        event.response.emailMessage = emailHtml;
        event.response.emailSubject = i18n.__("email.admin_create_user.subject");
        Log.info('Sending Email: ', {email: emailHtml});
      }

    } else if (event.triggerSource === "CustomMessage_ForgotPassword") {
      // Handle forgot password custom messages
      const url = `${process.env.DEEP_LINK_URL}/reset-password?username=${encodeURIComponent(username)}&code={####}`;

      if ((phone_number as string).length > 0) {
        event.response.smsMessage = `${i18n.__("email.forgot_password.sms_message")} ${url}`;
        Log.info('Sending SMS: ', {smsMessage: event.response.smsMessage});
      }

      if ((email as string).length > 0) {
        const emailHtml = await loadEmailTemplate("forgot-password-email", {
          i18n_text: i18n.__("email.forgot_password.text"),
          i18n_username: i18n.__("email.forgot_password.username"),
          i18n_code: i18n.__("email.forgot_password.code"),
          i18n_button: i18n.__("email.forgot_password.button"),
          i18n_disregard: i18n.__("email.forgot_password.disregard"),
          i18n_get_app: i18n.__("email.forgot_password.get_app"),
          i18n_need_help: i18n.__("email.forgot_password.need_help"),
          i18n_sign: i18n.__("email.forgot_password.sign"),
          i18n_footer: i18n.__("email.forgot_password.footer"),
          buttonUrl: url,
          cognito_username: email?.length > 0 && phone_number?.length > 0
            ? i18n.__("email.admin_create_user.email_or_phone", {email, phone_number})
            : (email?.length > 0 ? email : phone_number),
        });
        
        event.response.emailMessage = emailHtml;
        event.response.emailSubject = i18n.__("email.forgot_password.subject");
      }
    }

    return event;
  } catch (error) {
    Log.error("Error generating custom cognito message:", {error});
    throw error;
  }
};