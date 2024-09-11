export * as Cognito from "./cognito";
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminGetUserCommandOutput,
  AdminCreateUserCommand,
  AdminCreateUserCommandOutput,
  AdminDisableUserCommand,
  UserType,
  AdminDisableUserCommandOutput,
  AdminEnableUserCommand,
  AdminEnableUserCommandOutput,
  AdminResetUserPasswordCommand,
  AdminResetUserPasswordCommandOutput,
  AdminDeleteUserCommand,
  AdminDeleteUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "sst/node/config";

const cognitoClient = new CognitoIdentityProviderClient({});
const userPoolId = Config.COGNITO_USER_POOL_ID;

// Function to get an existing user by email
export const getUserByEmail = async (username: string): Promise<AdminGetUserCommandOutput | null> => {
  try {
    // Parameters for getting user by email
    const command = new AdminGetUserCommand({
      UserPoolId: userPoolId,
      Username: username,
    });

    const response: AdminGetUserCommandOutput = await cognitoClient.send(command);
    if (response?.$metadata.httpStatusCode == 200) {
      return response;
    }
    return null;
  } catch {
    console.info("User Not found");
  }
  return null;
}

export const createUser = async (username: string): Promise<UserType | undefined> => {
  // Parameters for getting user by email
  try {
    const command = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: [
        {
          Name: 'email',
          Value: username,
        },
        {
          Name: 'email_verified',
          Value: "true",
        }
      ]
    });
  
    const response: AdminCreateUserCommandOutput = await cognitoClient.send(command);
    if (response?.$metadata.httpStatusCode == 200) {
      return response.User!;
    }
  } catch (err) {
    console.error(err);
  }
}

export const deleteUser = async (username: string): Promise<boolean | undefined> => {
  // Parameters for getting user by email
  try {
    const command = new AdminDeleteUserCommand({
      UserPoolId: userPoolId,
      Username: username
    });
  
    const response: AdminDeleteUserCommandOutput = await cognitoClient.send(command);
    return response.$metadata.httpStatusCode == 200;
  } catch (err) {
    console.error(err);
  }
}

export const disableUser = async (username: string): Promise<boolean | undefined> => {
  // Parameters for getting user by email
  try {
    const command = new AdminDisableUserCommand({
      UserPoolId: userPoolId,
      Username: username
    });
  
    const response: AdminDisableUserCommandOutput = await cognitoClient.send(command);
    return response?.$metadata.httpStatusCode == 200;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const enableUser = async (username: string): Promise<boolean | undefined> => {
  // Parameters for getting user by email
  try {
    const command = new AdminEnableUserCommand({
      UserPoolId: userPoolId,
      Username: username
    });
  
    const response: AdminEnableUserCommandOutput = await cognitoClient.send(command);
    return response.$metadata.httpStatusCode == 200;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const resetPassword = async (username: string): Promise<boolean | undefined> => {
  // Parameters for getting user by email
  try {
    const command = new AdminResetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: username
    });
  
    const response: AdminResetUserPasswordCommandOutput = await cognitoClient.send(command);
    return response.$metadata.httpStatusCode == 200;
  } catch (err) {
    console.error(err);
    return false;
  }
}