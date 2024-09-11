import Log from '@dazn/lambda-powertools-logger';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import fs from "fs-extra";

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
    // Handle sign-up and forgot password custom messages
    if (event.triggerSource === "CustomMessage_AdminCreateUser") {
      const emailHtml = await loadEmailTemplate("admin-create-user-email", {
        signInUrl: process.env.AUTH_SIGN_IN_URL,
        contactEmail: "hello@sust.pro"
      });
      
      // Set the email message in HTML format
      event.response.emailMessage = emailHtml;
      event.response.emailSubject = "Welcome to Sust Pro!";
    } else if (event.triggerSource === "CustomMessage_ForgotPassword") {
      const emailHtml = await loadEmailTemplate("forgot-password-email", {
        signInUrl: process.env.AUTH_SIGN_IN_URL,
        contactEmail: "hello@sust.pro",
        username: email,
      });
      
      event.response.emailMessage = emailHtml;
      event.response.emailSubject = "Sust Pro, reset your password";
    }

    Log.info("Response Cognito Event: ", {event});
    return event;
  } catch (error) {
    console.error("Error generating custom cognito message:", error);
    throw error;
  }
};