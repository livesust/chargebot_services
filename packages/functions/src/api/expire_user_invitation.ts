import Log from '@dazn/lambda-powertools-logger';
import { User } from "@chargebot-services/core/services/user";
import { UserInviteStatus } from "@chargebot-services/core/database/user";
import { UserEmail as UserEmailService } from '@chargebot-services/core/services/user_email';
import { Cognito } from "@chargebot-services/core/services/aws/cognito";
import { UserEmail } from '@chargebot-services/core/database/user_email';

export const main = async () => {
  try {
    const expiredUsers = await User.findExpired(30);

    if (expiredUsers?.length === 0) {
      Log.debug(`Not users to expire invitation`);
      return;
    }
    Log.debug(`${expiredUsers?.length} users to expire invitation`);

    const emails: UserEmail[] = (await Promise.all(
      expiredUsers?.map(async (user) => 
        UserEmailService.findByCriteria({
          user_id: user.id
        })
      ) ?? []
    )).flat();

    await Promise.all(emails?.map(async (userEmail) => 
      Cognito.disableUser(userEmail.email_address)
    ) ?? []);

    const now = new Date()
    await Promise.all(expiredUsers?.map(async (user) => 
      User.update(user.id!, {
        invite_status: UserInviteStatus.EXPIRED,
        modified_by: 'SYSTEM',
        modified_date: now
      })
    ) ?? []);

  } catch (error) {
    Log.error("ERROR", { error });
  }
};