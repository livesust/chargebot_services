import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Config } from "sst/node/config";
import Log from '@dazn/lambda-powertools-logger';

const cognito = new CognitoIdentityServiceProvider();

export const main = async (event) => {
  const sourceUserPoolId = 'us-east-1_5a9RVYvKe';
  const sourceUserPoolClientId = '60okfiu05vketre2m8ge32heos';
  const targetUserPoolId = 'us-east-1_gpf6Z2tJq';
  const username = event.userName;
  const password = event.request.password;

  try {
    Log.info(`Admin initiate auth ${username} on ${sourceUserPoolId}`, {event});
    // Intentar autenticación en el pool anterior
    await cognito.adminInitiateAuth({
      UserPoolId: sourceUserPoolId,
      ClientId: sourceUserPoolClientId, // El cliente del pool original
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    }).promise();

    // Si la autenticación es exitosa, migra al usuario al nuevo pool
    await migrateUserToNewPool(username, sourceUserPoolId, targetUserPoolId);

    // Permitir el inicio de sesión en el nuevo pool
    event.response.finalUserStatus = 'CONFIRMED';
    event.response.messageAction = 'SUPPRESS';
    return event;
  } catch (err) {
    console.error('Error authenticating user in old pool:', err);
    throw new Error('Unauthorized');
  }
};

async function migrateUserToNewPool(username: string, sourceUserPoolId: string, targetUserPoolId: string) {
  try {
    Log.info(`Migrate user to new pool ${username}`);
    const user = await cognito.adminGetUser({
      UserPoolId: sourceUserPoolId,
      Username: username,
    }).promise();

    const email = user.UserAttributes!.find(a => a.Name === 'email')!.Value!;
    const sub = user.UserAttributes!.find(a => a.Name === 'sub')!.Value!;

    await cognito.adminCreateUser({
      UserPoolId: targetUserPoolId,
      Username: username,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'custom:userSub', Value: sub }
      ],
      MessageAction: 'SUPPRESS',
      ForceAliasCreation: true
    }).promise();
          
    const groups = await getUserGroups(sourceUserPoolId, user.Username!);
    for (const group of groups) {
      try {
        try {
          await cognito.createGroup({
            GroupName: group,
            UserPoolId: targetUserPoolId
          }).promise();
        } catch (_) {
          // Ignore
        }
        
        await cognito.adminAddUserToGroup({
          UserPoolId: targetUserPoolId,
          Username: email,
          GroupName: group
        }).promise();
      } catch (e) {
        console.error(`Error adding user ${username} to group ${group}:`, e);
      }
    }
          
    Log.info(`Successfully migrated user ${username}`);
  } catch (e) {
    Log.info(`Error migrating user ${username}:`, {error: e});
  }
}

// Función auxiliar para obtener los grupos de un usuario
async function getUserGroups(userPoolId: string, username: string) {
  const response = await cognito.adminListGroupsForUser({
    Username: username,
    UserPoolId: userPoolId
  }).promise();
  
  return (response.Groups || []).map(g => g.GroupName!);
}
