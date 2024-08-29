import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";
import { Cognito } from "@chargebot-services/core/services/aws/cognito";
import { UserRole } from "@chargebot-services/core/services/user_role";
import { UserEmail } from "@chargebot-services/core/services/user_email";
import { UserPhone } from "@chargebot-services/core/services/user_phone";
import { BotUser } from "@chargebot-services/core/services/bot_user";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const cognito_id = event?.detail?.user_id;
  const user_id = event?.detail?.id;
  const deleted_by = event?.detail?.deleted_by;
  if (event?.source === 'deleted') {
    console.log(`Delete user from Cognito: ${cognito_id}`);
    await Cognito.deleteUser(cognito_id);
    console.log(`Delete related user concepts`);
    const [role, email, phone, bots] = await Promise.all([
      UserRole.lazyFindOneByCriteria({user_id}),
      UserEmail.lazyFindOneByCriteria({user_id}),
      UserPhone.lazyFindOneByCriteria({user_id}),
      BotUser.lazyFindByCriteria({user_id}),
    ]);
    await Promise.all([
      role ? UserRole.remove(role.id!, deleted_by) : Promise.resolve(),
      email ? UserEmail.remove(email.id!, deleted_by) : Promise.resolve(),
      phone ? UserPhone.remove(phone.id!, deleted_by) : Promise.resolve(),
      bots?.length > 0 ? bots.map(b => BotUser.remove(b.id!, deleted_by)) : Promise.resolve([]),
    ]);
  }
};

export const main = middy(handler).use(warmup({ isWarmingUp }));