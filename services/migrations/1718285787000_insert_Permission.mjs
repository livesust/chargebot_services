import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  const audit = {
    created_date: new Date(),
    created_by: 'SYSTEM',
    modified_date: new Date(),
    modified_by: 'SYSTEM',
  };

  const permissions = [
    {
      id: 1,
      name: "Notifications",
      description: "Push notifications",
      ...audit
    },
    {
      id: 2,
      name: "Location",
      description: "Track GPS Location",
      ...audit
    },
  ];

  const appInstalls = await db.selectFrom('app_install').selectAll().execute();

  await db.deleteFrom('permission').execute();
  await db.deleteFrom('app_install_permissions').execute();

  await db.insertInto('permission')
    .values(permissions)
    .execute();
  
  for (const permission of permissions) {
    for (const appInstall of appInstalls) {
      await db.insertInto('app_install_permissions')
        .values({
          permission_status: true,
          app_install_id: appInstall.id,
          permission_id: permission.id,
          ...audit
        })
        .execute();
    }
  }
}

/**
 * @param db {Kysely<any>}
 */
export async function down() {
}