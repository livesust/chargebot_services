export * as Cognito from "./cognito";
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminGetUserCommandOutput,
  AdminCreateUserCommand,
  AdminCreateUserCommandOutput,
  UserType
} from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "sst/node/config";

const cognitoClient = new CognitoIdentityProviderClient({});
const userPoolId = Config.COGNITO_USER_POOL_ID;

// Function to get an existing user by email
export const getUserByEmail = async (email: string): Promise<AdminGetUserCommandOutput | null> => {
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

export const createUser = async (email: string): Promise<UserType | undefined> => {
  // Parameters for getting user by email
  try {
    const command = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email
    });
  
    const response: AdminCreateUserCommandOutput = await cognitoClient.send(command);
    if (response?.$metadata.httpStatusCode == 200) {
      return response.User!;
    }
  } catch (err) {
    console.error(err);
  }
}