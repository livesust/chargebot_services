import { createError } from '@middy/util';
import { BotVersion } from "./bot_version";
import { UserRole } from "./user_role";
import { UserPhone } from "./user_phone";
import { UserEmail } from "./user_email";
import { User } from "./user";
import { UniversalAppSettings } from "./universal_app_settings";
import { StateMaster } from "./state_master";
import { ScheduledAlert } from "./scheduled_alert";
import { Role } from "./role";
import { Permission } from "./permission";
import { OutletType } from "./outlet_type";
import { OutletSchedule } from "./outlet_schedule";
import { OutletEquipment } from "./outlet_equipment";
import { Outlet } from "./outlet";
import { HomeMaster } from "./home_master";
import { EquipmentType } from "./equipment_type";
import { Equipment } from "./equipment";
import { Customer } from "./customer";
import { Component } from "./component";
import { Company } from "./company";
import { BotUser } from "./bot_user";
import { BotScheduledAlerts } from "./bot_scheduled_alerts";
import { BotFirmware } from "./bot_firmware";
import { BotComponent } from "./bot_component";
import { BotCompany } from "./bot_company";
import { BotChargingSettings } from "./bot_charging_settings";
import { BotAlert } from "./bot_alert";
import { Bot } from "./bot";
import { AppSettingsType } from "./app_settings_type";
import { AppInstallPermissions } from "./app_install_permissions";
import { AppInstall } from "./app_install";
import { AlertType } from "./alert_type";
// DO NOT REMOVE THIS LINE: PLOP SERVICE IMPORT

export const loadService = async (entity_name: string) => {
    let service;

    if ("bot_version" === entity_name) { service = BotVersion; }
    if ("user_role" === entity_name) { service = UserRole; }
    if ("user_phone" === entity_name) { service = UserPhone; }
    if ("user_email" === entity_name) { service = UserEmail; }
    if ("user" === entity_name) { service = User; }
    if ("universal_app_settings" === entity_name) { service = UniversalAppSettings; }
    if ("state_master" === entity_name) { service = StateMaster; }
    if ("scheduled_alert" === entity_name) { service = ScheduledAlert; }
    if ("role" === entity_name) { service = Role; }
    if ("permission" === entity_name) { service = Permission; }
    if ("outlet_type" === entity_name) { service = OutletType; }
    if ("outlet_schedule" === entity_name) { service = OutletSchedule; }
    if ("outlet_equipment" === entity_name) { service = OutletEquipment; }
    if ("outlet" === entity_name) { service = Outlet; }
    if ("home_master" === entity_name) { service = HomeMaster; }
    if ("equipment_type" === entity_name) { service = EquipmentType; }
    if ("equipment" === entity_name) { service = Equipment; }
    if ("customer" === entity_name) { service = Customer; }
    if ("component" === entity_name) { service = Component; }
    if ("company" === entity_name) { service = Company; }
    if ("bot_user" === entity_name) { service = BotUser; }
    if ("bot_scheduled_alerts" === entity_name) { service = BotScheduledAlerts; }
    if ("bot_firmware" === entity_name) { service = BotFirmware; }
    if ("bot_component" === entity_name) { service = BotComponent; }
    if ("bot_company" === entity_name) { service = BotCompany; }
    if ("bot_charging_settings" === entity_name) { service = BotChargingSettings; }
    if ("bot_alert" === entity_name) { service = BotAlert; }
    if ("bot" === entity_name) { service = Bot; }
    if ("app_settings_type" === entity_name) { service = AppSettingsType; }
    if ("app_install_permissions" === entity_name) { service = AppInstallPermissions; }
    if ("app_install" === entity_name) { service = AppInstall; }
    if ("alert_type" === entity_name) { service = AlertType; }
// DO NOT REMOVE THIS LINE: PLOP SERVICE IF

    if (!service) {
        const error = createError(500, "Service not supported");
        throw error;
    }
    return service;
}