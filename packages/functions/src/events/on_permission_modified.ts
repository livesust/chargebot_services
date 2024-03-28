import middy from "@middy/core";
import warmup from "@middy/warmup";
import { isWarmingUp } from "../shared/rest_utils";
import { AppInstallPermissions } from "@chargebot-services/core/services/app_install_permissions";
import { AppInstall } from "@chargebot-services/core/services/app_install";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  const entity_id = event?.detail?.id;
  const user_id = event?.detail?.deleted_by;
  if (event?.source === 'deleted') {
    console.log(`Delete AppInstallPermissions by Permission deleted ${entity_id}`);
    const appPermissions = await AppInstallPermissions.lazyFindByCriteria({permission_id: entity_id})
    await Promise.all(
      appPermissions.map(async (appPermission) => {
        AppInstallPermissions.remove(appPermission!.id!, user_id);
      })
    );
  } else if (event?.source === 'created') {
    console.log(`Create AppInstallPermissions by Permission created ${entity_id}`);
    const now = new Date();
    const appPermissions = await AppInstall.list()
    await Promise.all(
      appPermissions.map(async (appPermission) => {
        AppInstallPermissions.create({
          permission_status: false,
          permission_id: entity_id,
          app_install_id: appPermission.id!,
          created_by: user_id,
          created_date: now,
          modified_by: user_id,
          modified_date: now,
        })
      })
    );
  }
};

export const main = middy(handler).use(warmup({ isWarmingUp }));