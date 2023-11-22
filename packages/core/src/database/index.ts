import { Kysely, ParseJSONResultsPlugin } from "kysely";
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
import { BotVersionTable } from "./bot_version";
import { BotScheduledAlertsTable } from "./bot_scheduled_alerts";
import { BotFirmwareTable } from "./bot_firmware";
import { BotComponentTable } from "./bot_component";
import { BotCompanyTable } from "./bot_company";
import { BotChargingSettingsTable } from "./bot_charging_settings";
import { BotAlertTable } from "./bot_alert";
import { AppSettingsTypeTable } from "./app_settings_type";
import { AppInstallPermissionsTable } from "./app_install_permissions";
import { AppInstallTable } from "./app_install";
import { BotUserTable } from "./bot_user";
// DO NOT REMOVE THIS LINE: PLOP ENTITY IMPORT

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
  bot_version: BotVersionTable,
  bot_scheduled_alerts: BotScheduledAlertsTable,
  bot_firmware: BotFirmwareTable,
  bot_component: BotComponentTable,
  bot_company: BotCompanyTable,
  bot_charging_settings: BotChargingSettingsTable,
  bot_alert: BotAlertTable,
  app_settings_type: AppSettingsTypeTable,
  app_install_permissions: AppInstallPermissionsTable,
  app_install: AppInstallTable,
  bot_user: BotUserTable,
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
});
