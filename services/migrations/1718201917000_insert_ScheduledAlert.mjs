import { Kysely, sql } from "kysely";
/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .alterTable('scheduled_alert')
    .dropColumn('alert_content')
    .addColumn("config_settings", "json")
    .execute();

  await db.deleteFrom('scheduled_alert').execute();
  await db.deleteFrom('user_scheduled_alerts').execute();

  const audit = {
    created_date: new Date(),
    created_by: 'SYSTEM',
    modified_date: new Date(),
    modified_by: 'SYSTEM',
  };

  const alertSchedules = [
    {
      id: 1,
      name: 'Not Plugged In',
      description: 'This alert will send a notification if ChargeBot is not plugged into grid power at a certain hour of the day. It will send every day of the week.',
      config_settings: {
        time: {type: 'time', default: "20:00"}
      },
      ...audit
    },
    {
      id: 2,
      name: 'Battery Low',
      description: 'This alert will send a notification if ChargeBot battery is below 20%.',
      ...audit
    },
    {
      id: 3,
      name: 'Arrive Home',
      description: 'This alert will send a notification if ChargeBot arrived home.',
      ...audit
    },
    {
      id: 4,
      name: 'Leave Home',
      description: 'This alert will send a notification if ChargeBot leave home.',
      ...audit
    },
    {
      id: 5,
      name: 'Long Stop',
      description: 'This alert will send a notification if ChargeBot is parked for more than 5 minutes.',
      config_settings: {
        time_period: {type: 'number', default: 1, unit: 'hours'},
      },
      ...audit
    },
    {
      id: 6,
      name: 'Daily Use',
      description: 'This alert will send a notification if ChargeBot is kWh usage is greater than limit.',
      config_settings: {
        time: {type: 'time', default: "20:00"}
      },
      ...audit
    },
    {
      id: 7,
      name: 'Nothing Charging',
      description: 'This alert will send a notification if ChargeBot outlets are not charging.',
      config_settings: {
        time: {type: 'time', default: "20:00"}
      },
      ...audit
    },
  ];

  for (const alert of alertSchedules) {
    await db.insertInto('scheduled_alert')
      .values({
        ...alert,
        config_settings: alert.config_settings ? sql`CAST(${JSON.stringify(alert.config_settings)} AS JSONB)` : undefined
      })
      .execute();
  }

  const users = await db.selectFrom('user')
    .selectAll()
    .execute();

  for (const user of users) {
    for (const alert of alertSchedules) {
      const scheduled = {
        alert_status: true,
        user_id: user.id,
        scheduled_alert_id: alert.id,
        settings: alert.config_settings ? Object.keys(alert.config_settings).reduce((acc, key) => {
          acc[key] = alert.config_settings[key].default;
          return acc;
        }, {}) : undefined,
        ...audit
      };
      await db.insertInto('user_scheduled_alerts')
        .values({
          ...scheduled,
          settings: scheduled.settings ? sql`CAST(${JSON.stringify(scheduled.settings)} AS JSONB)` : undefined
        })
        .execute()
    }
  }
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.deleteFrom('scheduled_alert').execute();
  await db.deleteFrom('user_scheduled_alerts').execute();
  await db.schema
    .alterTable('scheduled_alert')
    .dropColumn('config_settings')
    .addColumn("alert_content", "text")
    .execute();
}