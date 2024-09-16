import Log from '@dazn/lambda-powertools-logger';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import fs from "fs-extra";
import i18n from '../shared/i18n/i18n';

// Function to load and customize the HTML template
const loadEmailTemplate = async (templateName: string, replacements?: object) => {
  const templatePath = `./packages/functions/src/shared/templates/${templateName}.html`;
  let template = await fs.readFile(templatePath, "utf-8");

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
  const { email } = event.request.userAttributes;

  try {
    if (event.triggerSource === "CustomMessage_AdminCreateUser") {
      // Handle sign-up custom messages
      const emailHtml = await loadEmailTemplate("admin-create-user-email", {
        i18n_text: i18n.__("email.admin_create_user.text"),
        i18n_username: i18n.__("email.admin_create_user.username"),
        i18n_password: i18n.__("email.admin_create_user.password"),
        i18n_button: i18n.__("email.admin_create_user.button"),
        i18n_get_app: i18n.__("email.admin_create_user.get_app"),
        i18n_need_help: i18n.__("email.admin_create_user.need_help"),
        i18n_sign: i18n.__("email.admin_create_user.sign"),
        i18n_footer: i18n.__("email.admin_create_user.footer"),
        signInUrl: process.env.AUTH_SIGN_IN_URL,
      });
      
      event.response.emailMessage = emailHtml;
      event.response.emailSubject = i18n.__("email.admin_create_user.subject");
    } else if (event.triggerSource === "CustomMessage_ForgotPassword") {
      // Handle forgot password custom messages
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
        resetPasswordUrl: `${process.env.FORGOT_PASSWORD_URL}?email=${email}`,
        username: email,
      });
      
      event.response.emailMessage = emailHtml;
      event.response.emailSubject = i18n.__("email.forgot_password.subject");
    }

    return event;
  } catch (error) {
    Log.error("Error generating custom cognito message:", {error});
    throw error;
  }
};