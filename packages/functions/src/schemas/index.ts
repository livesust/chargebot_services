import Log from '@dazn/lambda-powertools-logger';
import { createError } from '@middy/util';
import * as BotVersion from "./bot_version.schema";
import * as UserRole from "./user_role.schema";
import * as UserPhone from "./user_phone.schema";
import * as UserEmail from "./user_email.schema";
import * as User from "./user.schema";
import * as UniversalAppSettings from "./universal_app_settings.schema";
import * as StateMaster from "./state_master.schema";
import * as ScheduledAlert from "./scheduled_alert.schema";
import * as Role from "./role.schema";
import * as Permission from "./permission.schema";
import * as OutletType from "./outlet_type.schema";
import * as OutletSchedule from "./outlet_schedule.schema";
import * as OutletEquipment from "./outlet_equipment.schema";
import * as Outlet from "./outlet.schema";
import * as HomeMaster from "./home_master.schema";
import * as EquipmentType from "./equipment_type.schema";
import * as Equipment from "./equipment.schema";
import * as Customer from "./customer.schema";
import * as Component from "./component.schema";
import * as Company from "./company.schema";
import * as BotUser from "./bot_user.schema";
import * as BotFirmware from "./bot_firmware.schema";
import * as BotComponent from "./bot_component.schema";
import * as BotCompany from "./bot_company.schema";
import * as BotChargingSettings from "./bot_charging_settings.schema";
import * as BotAlert from "./bot_alert.schema";
import * as Bot from "./bot.schema";
import * as AppSettingsType from "./app_settings_type.schema";
import * as AppInstallPermissions from "./app_install_permissions.schema";
import * as AppInstall from "./app_install.schema";
import * as AlertType from "./alert_type.schema";
import * as UserScheduledAlerts from "./user_scheduled_alerts.schema";
import * as VehicleType from "./vehicle_type.schema";
import * as Vehicle from "./vehicle.schema";
// DO NOT REMOVE THIS LINE: PLOP SCHEMA IMPORT

export const loadSchemas = (entity_name: string) => {
  let schema;

  if ("bot_version" === entity_name) { schema = BotVersion; }
  if ("user_role" === entity_name) { schema = UserRole; }
  if ("user_phone" === entity_name) { schema = UserPhone; }
  if ("user_email" === entity_name) { schema = UserEmail; }
  if ("user" === entity_name) { schema = User; }
  if ("universal_app_settings" === entity_name) { schema = UniversalAppSettings; }
  if ("state_master" === entity_name) { schema = StateMaster; }
  if ("scheduled_alert" === entity_name) { schema = ScheduledAlert; }
  if ("role" === entity_name) { schema = Role; }
  if ("permission" === entity_name) { schema = Permission; }
  if ("outlet_type" === entity_name) { schema = OutletType; }
  if ("outlet_schedule" === entity_name) { schema = OutletSchedule; }
  if ("outlet_equipment" === entity_name) { schema = OutletEquipment; }
  if ("outlet" === entity_name) { schema = Outlet; }
  if ("home_master" === entity_name) { schema = HomeMaster; }
  if ("equipment_type" === entity_name) { schema = EquipmentType; }
  if ("equipment" === entity_name) { schema = Equipment; }
  if ("customer" === entity_name) { schema = Customer; }
  if ("component" === entity_name) { schema = Component; }
  if ("company" === entity_name) { schema = Company; }
  if ("bot_user" === entity_name) { schema = BotUser; }
  if ("bot_firmware" === entity_name) { schema = BotFirmware; }
  if ("bot_component" === entity_name) { schema = BotComponent; }
  if ("bot_company" === entity_name) { schema = BotCompany; }
  if ("bot_charging_settings" === entity_name) { schema = BotChargingSettings; }
  if ("bot_alert" === entity_name) { schema = BotAlert; }
  if ("bot" === entity_name) { schema = Bot; }
  if ("app_settings_type" === entity_name) { schema = AppSettingsType; }
  if ("app_install_permissions" === entity_name) { schema = AppInstallPermissions; }
  if ("app_install" === entity_name) { schema = AppInstall; }
  if ("alert_type" === entity_name) { schema = AlertType; }
  if ("user_scheduled_alerts" === entity_name) { schema = UserScheduledAlerts; }
  if ("vehicle_type" === entity_name) { schema = VehicleType; }
  if ("vehicle" === entity_name) { schema = Vehicle; }
  // DO NOT REMOVE THIS LINE: PLOP SCHEMA IF

  if (!schema) {
    Log.error('Entity Schema Not Found', { entity_name });
    const error = createError(406, "Service not supported");
    throw error;
  }
  return schema;
}