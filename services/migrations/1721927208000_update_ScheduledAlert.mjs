import { Kysely, sql } from "kysely";
/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  const alertSchedules = [
    {
      id: 1,
      name: 'scheduled_alert.not_plugged_in.name',
      description: 'scheduled_alert.not_plugged_in.description',
    },
    {
      id: 2,
      name: 'scheduled_alert.battery_low.name',
      description: 'scheduled_alert.battery_low.description',
    },
    {
      id: 3,
      name: 'scheduled_alert.arrive_home.name',
      description: 'scheduled_alert.arrive_home.description',
    },
    {
      id: 4,
      name: 'scheduled_alert.leave_home.name',
      description: 'scheduled_alert.leave_home.description',
    },
    {
      id: 5,
      name: 'scheduled_alert.long_stop.name',
      description: 'scheduled_alert.long_stop.description',
    },
    {
      id: 6,
      name: 'scheduled_alert.daily_use.name',
      description: 'scheduled_alert.daily_use.description',
    },
    {
      id: 7,
      name: 'scheduled_alert.nothing_charging.name',
      description: 'scheduled_alert.nothing_charging.description',
    },
  ];

  for (const alert of alertSchedules) {
    await db.updateTable('scheduled_alert')
      .set(alert)
      .where('id', '=', alert.id)
      .execute();
  }

}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
}