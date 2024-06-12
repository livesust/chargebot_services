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

  await db.deleteFrom('scheduled_alert').execute()
  await db.insertInto('scheduled_alert')
    .values([
      {
        name: 'Not Plugged In',
        description: 'This alert will send a notification if ChargeBot is not plugged into grid power at a certain hour of the day. It will send every day of the week.',
        config_settings: sql`CAST(${JSON.stringify({
          enabled: {type: 'boolean', default: false},
          time: {type: 'time', default: "20:00"}
        })} AS JSONB)`
      },
      {
        name: 'Battery Low',
        description: 'This alert will send a notification if ChargeBot battery is below 20%.',
        config_settings: sql`CAST(${JSON.stringify({
          enabled: {type: 'boolean', default: true},
        })} AS JSONB)`
      },
      {
        name: 'Arrive Home',
        description: 'This alert will send a notification if ChargeBot arrived home.',
        config_settings: sql`CAST(${JSON.stringify({
          enabled: {type: 'boolean', default: true},
        })} AS JSONB)`
      },
      {
        name: 'Leave Home',
        description: 'This alert will send a notification if ChargeBot leave home.',
        config_settings: sql`CAST(${JSON.stringify({
          enabled: {type: 'boolean', default: true},
        })} AS JSONB)`
      },
      {
        name: 'Long Stop',
        description: 'This alert will send a notification if ChargeBot is parked for more than 5 minutes.',
        config_settings: sql`CAST(${JSON.stringify({
          enabled: {type: 'boolean', default: true},
          time_period: {type: 'number', default: 1, unit: 'hours'},
        })} AS JSONB)`
      },
      {
        name: 'Daily Use',
        description: 'This alert will send a notification if ChargeBot is kWh usage is greater than limit.',
        config_settings: sql`CAST(${JSON.stringify({
          enabled: {type: 'boolean', default: false},
          time: {type: 'time', default: "20:00"}
        })} AS JSONB)`
      },
      {
        name: 'Nothing Charging',
        description: 'This alert will send a notification if ChargeBot outlets are not charging.',
        config_settings: sql`CAST(${JSON.stringify({
          enabled: {type: 'boolean', default: false},
          time: {type: 'time', default: "20:00"}
        })} AS JSONB)`
      },
    ])
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.deleteFrom('scheduled_alert').execute()
  await db.schema
    .alterTable('scheduled_alert')
    .dropColumn('config_settings')
    .addColumn("alert_content", "text")
    .execute();
}