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
  DeliveryMediumType,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandOutput,
  AttributeType,
} from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "sst/node/config";
import Log from '@dazn/lambda-powertools-logger';
import { randomUUID } from "crypto"; 'crypto';

const cognitoClient = new CognitoIdentityProviderClient({});
const emailUserPoolId = Config.COGNITO_USER_POOL_ID;

// Function to get an existing user by email
export const getUserByUsername = async (username: string): Promise<AdminGetUserCommandOutput | null> => {
  try {
    // Parameters for getting user by email
    const command = new AdminGetUserCommand({
      UserPoolId: emailUserPoolId,
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

export const createUser = async (email: string, phone_number: string, invite_method: 'email' | 'phone_number'): Promise<{cognitoUser: UserType | undefined, userId: string} | undefined> => {
  // Parameters for getting user by email
  try {
    const attributes = [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'phone_number',
        Value: phone_number,
      },
      {
        Name: 'custom:invitationMethod',
        Value: invite_method,
      }
    ];
    if (phone_number?.length > 0) {
      attributes.push({
        Name: 'phone_number_verified',
        Value: "true",
      })
    }
    if (email?.length > 0) {
      attributes.push({
        Name: 'email_verified',
        Value: "true",
      })
    }
    let deliveredMediums: DeliveryMediumType[] = invite_method === 'email' ? ["EMAIL", "SMS"] : ["SMS", "EMAIL"];
    if (!email || email.length === 0) {
      deliveredMediums = deliveredMediums.filter(d => d !== "EMAIL");
    }
    if (!phone_number || phone_number.length === 0) {
      deliveredMediums = deliveredMediums.filter(d => d !== "SMS");
    }

    if (!deliveredMediums) {
      throw Error("Email or Phone Number must be provided");
    }

    Log.debug('Create User Delivered Mediums:', {deliveredMediums, email, phone_number});
    const username = randomUUID();
    const command = new AdminCreateUserCommand({
      UserPoolId: emailUserPoolId,
      Username: username,
      UserAttributes: attributes,
      ForceAliasCreation: false,
      DesiredDeliveryMediums: deliveredMediums,
    });
  
    const response: AdminCreateUserCommandOutput = await cognitoClient.send(command);
    if (response?.$metadata.httpStatusCode == 200) {
      return {
        cognitoUser: response.User!,
        userId: username
      };
    }
  } catch (err) {
    console.error(err);
  }
}

export const deleteUser = async (username: string): Promise<boolean | undefined> => {
  // Parameters for getting user by email
  try {
    const command = new AdminDeleteUserCommand({
      UserPoolId: emailUserPoolId,
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
      UserPoolId: emailUserPoolId,
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
      UserPoolId: emailUserPoolId,
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
      UserPoolId: emailUserPoolId,
      Username: username
    });
  
    const response: AdminResetUserPasswordCommandOutput = await cognitoClient.send(command);
    return response.$metadata.httpStatusCode == 200;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const updateEmail = async (username: string, email: string): Promise<boolean> => {
  // Parameters for getting user by email
  const attributes = [
    {
      Name: 'email',
      Value: email,
    }
  ];
  if (email?.length > 0) {
    attributes.push({
      Name: 'email_verified',
      Value: "true",
    })
  }
  return updateAttributes(username, attributes);
}

export const updatePhoneNumber = async (username: string, phoneNumber: string): Promise<boolean> => {
  // Parameters for getting user by email
  const attributes = [
    {
      Name: 'phone_number',
      Value: phoneNumber,
    }
  ];
  if (phoneNumber?.length > 0) {
    attributes.push({
      Name: 'phone_number_verified',
      Value: "true",
    })
  }
  return updateAttributes(username, attributes);
}

const updateAttributes = async (username: string, attributes: AttributeType[] | undefined): Promise<boolean> => {
  // Parameters for getting user by email
  try {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: emailUserPoolId,
      Username: username,
      UserAttributes: attributes
    });
  
    const response: AdminUpdateUserAttributesCommandOutput = await cognitoClient.send(command);
    return response.$metadata.httpStatusCode == 200;
  } catch (err) {
    console.error(err);
    return false;
  }
}