import { Kysely, ParseJSONResultsPlugin, RawBuilder, sql } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDSData } from "@aws-sdk/client-rds-data";
import { RDS } from "sst/node/rds";
import { BotTable } from "./bot";
import { CustomerTable } from "./customer";
import { CompanyTable } from "./company";
import { AlertTypeTable } from "./alert_type";
import { UserRoleTable } from "./user_role";
import { UserPhoneTable } from "./user_phone";
import { UserEmailTable } from "./user_email";
import { UserTable } from "./user";
import { UniversalAppSettingsTable } from "./universal_app_settings";
import { StateMasterTable } from "./state_master";
import { ScheduledAlertTable } from "./scheduled_alert";
import { RoleTable } from "./role";
import { PermissionTable } from "./permission";
import { OutletTypeTable } from "./outlet_type";
import { OutletScheduleTable } from "./outlet_schedule";
import { OutletEquipmentTable } from "./outlet_equipment";
import { OutletTable } from "./outlet";
import { HomeMasterTable } from "./home_master";
import { EquipmentTypeTable } from "./equipment_type";
import { EquipmentTable } from "./equipment";
import { ComponentTable } from "./component";
import { BotCompanyTable } from "./bot_company";
import { BotChargingSettingsTable } from "./bot_charging_settings";
import { BotAlertTable } from "./bot_alert";
import { AppSettingsTypeTable } from "./app_settings_type";
import { AppInstallPermissionsTable } from "./app_install_permissions";
import { AppInstallTable } from "./app_install";
import { BotUserTable } from "./bot_user";
import { VehicleTypeTable } from "./vehicle_type";
import { VehicleTable } from "./vehicle";
import { BotScheduledAlertTable } from "./bot_scheduled_alert";
import { BotComponentAttributeTable } from "./bot_component_attribute";
import { BotFirmwareInstallTable } from "./bot_firmware_install";
import { BotFirmwareVersionTable } from "./bot_firmware_version";
import { BotModelTable } from "./bot_model";
import { BotModelComponentTable } from "./bot_model_component";
import { ComponentAttributeTable } from "./component_attribute";
// DO NOT REMOVE THIS LINE: PLOP ENTITY IMPORT

export function json<T>(value: T): RawBuilder<T> {
    return sql`CAST(${JSON.stringify(value)} AS JSONB)`
}
export interface Database {
  bot: BotTable,
  customer: CustomerTable,
  company: CompanyTable,
  alert_type: AlertTypeTable,
  user_role: UserRoleTable,
  user_phone: UserPhoneTable,
  user_email: UserEmailTable,
  user: UserTable,
  universal_app_settings: UniversalAppSettingsTable,
  state_master: StateMasterTable,
  scheduled_alert: ScheduledAlertTable,
  role: RoleTable,
  permission: PermissionTable,
  outlet_type: OutletTypeTable,
  outlet_schedule: OutletScheduleTable,
  outlet_equipment: OutletEquipmentTable,
  outlet: OutletTable,
  home_master: HomeMasterTable,
  equipment_type: EquipmentTypeTable,
  equipment: EquipmentTable,
  component: ComponentTable,
  bot_company: BotCompanyTable,
  bot_charging_settings: BotChargingSettingsTable,
  bot_alert: BotAlertTable,
  app_settings_type: AppSettingsTypeTable,
  app_install_permissions: AppInstallPermissionsTable,
  app_install: AppInstallTable,
  bot_user: BotUserTable,
  vehicle_type: VehicleTypeTable,
  vehicle: VehicleTable,
  bot_scheduled_alert: BotScheduledAlertTable,
  bot_component_attribute: BotComponentAttributeTable,
  bot_firmware_install: BotFirmwareInstallTable,
  bot_firmware_version: BotFirmwareVersionTable,
  bot_model: BotModelTable,
  bot_model_component: BotModelComponentTable,
  component_attribute: ComponentAttributeTable,
// DO NOT REMOVE THIS LINE: PLOP ENTITY LIST
}

export default new Kysely<Database>({
    dialect: new DataApiDialect({
        mode: "postgres",
        driver: {
            database: RDS.RDSCluster.defaultDatabaseName,
            secretArn: RDS.RDSCluster.secretArn,
            resourceArn: RDS.RDSCluster.clusterArn,
            client: new RDSData({}),
        },        
    }),
    plugins: [new ParseJSONResultsPlugin()],
    // log(event): void {
    //   if (event.level === 'query') {
    //     console.log(`
    //     RDS Time: ${Math.round(event.queryDurationMillis)}ms
    //     SQL: ${event.query.sql}
    //     Params: ${JSON.stringify(event.query.parameters, null, 2)}
    //     `);
    //   }
    // },
});
