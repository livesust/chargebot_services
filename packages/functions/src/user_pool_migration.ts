import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Config } from "sst/node/config";
import Log from '@dazn/lambda-powertools-logger';

const cognito = new CognitoIdentityServiceProvider();

export const main = async () => {
  try {
    // Configuración
    const sourceUserPoolId = 'us-east-1_5a9RVYvKe';
    const targetUserPoolId = 'us-east-1_gpf6Z2tJq';
    
    // Obtener todos los usuarios del pool original
    const users = await listAllUsers(sourceUserPoolId);
    Log.info('Listed all users', {users: users.map(u => u.Username)});

    // Migrar cada usuario
    for (const user of users) {
      try {
        const email = user.Attributes!.find(a => a.Name === 'email')!.Value!;
        const sub = user.Attributes!.find(a => a.Name === 'sub')?.Value;
        // Crear usuario en el nuevo pool
        await cognito.adminCreateUser({
          UserPoolId: targetUserPoolId,
          Username: email,
          UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'email_verified', Value: "true" },
            { Name: 'custom:userSub', Value: sub }
          ],
          MessageAction: 'SUPPRESS', // No enviar emails
          ForceAliasCreation: true
        }).promise();
        
        // Si el usuario estaba confirmado, confirmarlo en el nuevo pool
        if (user.UserStatus === 'CONFIRMED') {
          await cognito.adminConfirmSignUp({
            UserPoolId: targetUserPoolId,
            Username: email
          }).promise();
        }
        
        // Copiar los grupos del usuario si existen
        const groups = await getUserGroups(sourceUserPoolId, user.Username!);
        for (const group of groups) {
          try {
            // Crear el grupo si no existe
            try {
              await cognito.createGroup({
                GroupName: group,
                UserPoolId: targetUserPoolId
              }).promise();
            } catch (_) {
              // Ignorar error si el grupo ya existe
            }
            
            // Añadir usuario al grupo
            await cognito.adminAddUserToGroup({
              UserPoolId: targetUserPoolId,
              Username: email,
              GroupName: group
            }).promise();
          } catch (e) {
            console.error(`Error adding user ${user.Username} to group ${group}:`, e);
          }
        }
        
        Log.info(`Successfully migrated user ${user.Username}`);
      } catch (e) {
        Log.info(`Error migrating user ${user.Username}:`, {error: e});
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully migrated ${users.length} users`
      })
    };
  } catch (error) {
    console.error('Error in migration:', error);
    throw error;
  }
};

// Función auxiliar para listar todos los usuarios
async function listAllUsers(userPoolId: string) {
  const users: CognitoIdentityServiceProvider.UserType[] = [];
  let paginationToken: string | undefined;
  
  do {
    const response = await cognito.listUsers({
      UserPoolId: userPoolId,
      PaginationToken: paginationToken
    }).promise();
    
    users.push(...(response.Users || []));
    paginationToken = response.PaginationToken;
  } while (paginationToken);
  
  return users;
}

// Función auxiliar para obtener los grupos de un usuario
async function getUserGroups(userPoolId: string, username: string) {
  const response = await cognito.adminListGroupsForUser({
    Username: username,
    UserPoolId: userPoolId
  }).promise();
  
  return (response.Groups || []).map(g => g.GroupName!);
}