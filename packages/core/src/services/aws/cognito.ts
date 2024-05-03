export * as Cognito from "./cognito";
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminGetUserCommandOutput,
  AdminCreateUserCommand,
  AdminCreateUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { User } from "../../database/user";
import { UserEmail } from "../../database/user_email";

const cognitoClient = new CognitoIdentityProviderClient({});

// Function to get an existing user by email
async function getUserByEmail(email: string, userPoolId: string): Promise<AdminGetUserCommandOutput | null> {
  try {
    // Parameters for getting user by email
    const command = new AdminGetUserCommand({
      UserPoolId: userPoolId,
      Username: email,
    });

    const response: AdminGetUserCommandOutput = await cognitoClient.send(command);
    if (response?.$metadata.httpStatusCode == 200) {
      return response;
    }
    return null;
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function createUser(user: User, userEmail: UserEmail, userPoolId: string): Promise<boolean> {
  // Parameters for getting user by email
  try {
    const command = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: userEmail.email_address,
      UserAttributes: [
        {
          Name: "first_name",
          Value: user.first_name
        },
        {
          Name: "last_name",
          Value: user.last_name
        },
        {
          Name: "company_id",
          Value: `${user.company_id}`
        }
      ]
    });
  
    const response: AdminCreateUserCommandOutput = await cognitoClient.send(command);
    return response?.$metadata.httpStatusCode == 200;
  } catch (err) {
    console.error(err);
  }
  return false;
}