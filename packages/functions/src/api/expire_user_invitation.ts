import Log from '@dazn/lambda-powertools-logger';
import { User } from "@chargebot-services/core/services/user";
import { UserInviteStatus } from "@chargebot-services/core/database/user";

export const main = async () => {
  try {
    const expiredUsers = await User.findExpired(180);

    if (expiredUsers?.length === 0) {
      Log.debug(`Not users to expire invitation`);
      return;
    }
    Log.debug(`${expiredUsers?.length} users to expire invitation`);

    const promises = [];
    const now = new Date()
    promises.push(expiredUsers?.map(async (user) => 
      User.update(user.id!, {
        invite_status: UserInviteStatus.EXPIRED,
        modified_by: 'SYSTEM',
        modified_date: now
      })
    ));

    await Promise.all(promises);

  } catch (error) {
    Log.error("ERROR", { error });
  }
};