// Bot routes -do not modify this plop comment-
const bot = {
    "GET /bot": "packages/functions/src/bot/list.main",
    "GET /bot/{id}": "packages/functions/src/bot/get.main",
    "POST /bot": "packages/functions/src/bot/create.main",
    "POST /bot/search": "packages/functions/src/bot/search.main",
    "PATCH /bot/{id}": "packages/functions/src/bot/update.main",
    "DELETE /bot/{id}": "packages/functions/src/bot/remove.main",
}

// Customer routes -do not modify this plop comment-
const customer = {
    "GET /customer": "packages/functions/src/customer/list.main",
    "GET /customer/{id}": "packages/functions/src/customer/get.main",
    "POST /customer": "packages/functions/src/customer/create.main",
    "POST /customer/search": "packages/functions/src/customer/search.main",
    "PATCH /customer/{id}": "packages/functions/src/customer/update.main",
    "DELETE /customer/{id}": "packages/functions/src/customer/remove.main",
}

// Company routes -do not modify this plop comment-
const company = {
    "GET /company": "packages/functions/src/company/list.main",
    "GET /company/{id}": "packages/functions/src/company/get.main",
    "POST /company": "packages/functions/src/company/create.main",
    "POST /company/search": "packages/functions/src/company/search.main",
    "PATCH /company/{id}": "packages/functions/src/company/update.main",
    "DELETE /company/{id}": "packages/functions/src/company/remove.main",
}

// AlertType routes -do not modify this plop comment-
const alert_type = {
    "GET /alert_type": "packages/functions/src/alert_type/list.main",
    "GET /alert_type/{id}": "packages/functions/src/alert_type/get.main",
    "POST /alert_type": "packages/functions/src/alert_type/create.main",
    "POST /alert_type/search": "packages/functions/src/alert_type/search.main",
    "PATCH /alert_type/{id}": "packages/functions/src/alert_type/update.main",
    "DELETE /alert_type/{id}": "packages/functions/src/alert_type/remove.main",
}

// UserRole routes -do not modify this plop comment-
const user_role = {
    "GET /user_role": "packages/functions/src/user_role/list.main",
    "GET /user_role/{id}": "packages/functions/src/user_role/get.main",
    "POST /user_role": "packages/functions/src/user_role/create.main",
    "POST /user_role/search": "packages/functions/src/user_role/search.main",
    "PATCH /user_role/{id}": "packages/functions/src/user_role/update.main",
    "DELETE /user_role/{id}": "packages/functions/src/user_role/remove.main",
}

// UserPhone routes -do not modify this plop comment-
const user_phone = {
    "GET /user_phone": "packages/functions/src/user_phone/list.main",
    "GET /user_phone/{id}": "packages/functions/src/user_phone/get.main",
    "POST /user_phone": "packages/functions/src/user_phone/create.main",
    "POST /user_phone/search": "packages/functions/src/user_phone/search.main",
    "PATCH /user_phone/{id}": "packages/functions/src/user_phone/update.main",
    "DELETE /user_phone/{id}": "packages/functions/src/user_phone/remove.main",
}

// UserEmail routes -do not modify this plop comment-
const user_email = {
    "GET /user_email": "packages/functions/src/user_email/list.main",
    "GET /user_email/{id}": "packages/functions/src/user_email/get.main",
    "POST /user_email": "packages/functions/src/user_email/create.main",
    "POST /user_email/search": "packages/functions/src/user_email/search.main",
    "PATCH /user_email/{id}": "packages/functions/src/user_email/update.main",
    "DELETE /user_email/{id}": "packages/functions/src/user_email/remove.main",
}

// User routes -do not modify this plop comment-
const user = {
    "GET /user": "packages/functions/src/user/list.main",
    "GET /user/{id}": "packages/functions/src/user/get.main",
    "POST /user": "packages/functions/src/user/create.main",
    "POST /user/search": "packages/functions/src/user/search.main",
    "PATCH /user/{id}": "packages/functions/src/user/update.main",
    "DELETE /user/{id}": "packages/functions/src/user/remove.main",
}

// UniversalAppSettings routes -do not modify this plop comment-
const universal_app_settings = {
    "GET /universal_app_settings": "packages/functions/src/universal_app_settings/list.main",
    "GET /universal_app_settings/{id}": "packages/functions/src/universal_app_settings/get.main",
    "POST /universal_app_settings": "packages/functions/src/universal_app_settings/create.main",
    "POST /universal_app_settings/search": "packages/functions/src/universal_app_settings/search.main",
    "PATCH /universal_app_settings/{id}": "packages/functions/src/universal_app_settings/update.main",
    "DELETE /universal_app_settings/{id}": "packages/functions/src/universal_app_settings/remove.main",
}

// StateMaster routes -do not modify this plop comment-
const state_master = {
    "GET /state_master": "packages/functions/src/state_master/list.main",
    "GET /state_master/{id}": "packages/functions/src/state_master/get.main",
    "POST /state_master": "packages/functions/src/state_master/create.main",
    "POST /state_master/search": "packages/functions/src/state_master/search.main",
    "PATCH /state_master/{id}": "packages/functions/src/state_master/update.main",
    "DELETE /state_master/{id}": "packages/functions/src/state_master/remove.main",
}

// ScheduledAlert routes -do not modify this plop comment-
const scheduled_alert = {
    "GET /scheduled_alert": "packages/functions/src/scheduled_alert/list.main",
    "GET /scheduled_alert/{id}": "packages/functions/src/scheduled_alert/get.main",
    "POST /scheduled_alert": "packages/functions/src/scheduled_alert/create.main",
    "POST /scheduled_alert/search": "packages/functions/src/scheduled_alert/search.main",
    "PATCH /scheduled_alert/{id}": "packages/functions/src/scheduled_alert/update.main",
    "DELETE /scheduled_alert/{id}": "packages/functions/src/scheduled_alert/remove.main",
}

// Role routes -do not modify this plop comment-
const role = {
    "GET /role": "packages/functions/src/role/list.main",
    "GET /role/{id}": "packages/functions/src/role/get.main",
    "POST /role": "packages/functions/src/role/create.main",
    "POST /role/search": "packages/functions/src/role/search.main",
    "PATCH /role/{id}": "packages/functions/src/role/update.main",
    "DELETE /role/{id}": "packages/functions/src/role/remove.main",
}

// Permission routes -do not modify this plop comment-
const permission = {
    "GET /permission": "packages/functions/src/permission/list.main",
    "GET /permission/{id}": "packages/functions/src/permission/get.main",
    "POST /permission": "packages/functions/src/permission/create.main",
    "POST /permission/search": "packages/functions/src/permission/search.main",
    "PATCH /permission/{id}": "packages/functions/src/permission/update.main",
    "DELETE /permission/{id}": "packages/functions/src/permission/remove.main",
}

// OutletType routes -do not modify this plop comment-
const outlet_type = {
    "GET /outlet_type": "packages/functions/src/outlet_type/list.main",
    "GET /outlet_type/{id}": "packages/functions/src/outlet_type/get.main",
    "POST /outlet_type": "packages/functions/src/outlet_type/create.main",
    "POST /outlet_type/search": "packages/functions/src/outlet_type/search.main",
    "PATCH /outlet_type/{id}": "packages/functions/src/outlet_type/update.main",
    "DELETE /outlet_type/{id}": "packages/functions/src/outlet_type/remove.main",
}

// OutletSchedule routes -do not modify this plop comment-
const outlet_schedule = {
    "GET /outlet_schedule": "packages/functions/src/outlet_schedule/list.main",
    "GET /outlet_schedule/{id}": "packages/functions/src/outlet_schedule/get.main",
    "POST /outlet_schedule": "packages/functions/src/outlet_schedule/create.main",
    "POST /outlet_schedule/search": "packages/functions/src/outlet_schedule/search.main",
    "PATCH /outlet_schedule/{id}": "packages/functions/src/outlet_schedule/update.main",
    "DELETE /outlet_schedule/{id}": "packages/functions/src/outlet_schedule/remove.main",
}

// OutletEquipment routes -do not modify this plop comment-
const outlet_equipment = {
    "GET /outlet_equipment": "packages/functions/src/outlet_equipment/list.main",
    "GET /outlet_equipment/{id}": "packages/functions/src/outlet_equipment/get.main",
    "POST /outlet_equipment": "packages/functions/src/outlet_equipment/create.main",
    "POST /outlet_equipment/search": "packages/functions/src/outlet_equipment/search.main",
    "PATCH /outlet_equipment/{id}": "packages/functions/src/outlet_equipment/update.main",
    "DELETE /outlet_equipment/{id}": "packages/functions/src/outlet_equipment/remove.main",
}

// Outlet routes -do not modify this plop comment-
const outlet = {
    "GET /outlet": "packages/functions/src/outlet/list.main",
    "GET /outlet/{id}": "packages/functions/src/outlet/get.main",
    "POST /outlet": "packages/functions/src/outlet/create.main",
    "POST /outlet/search": "packages/functions/src/outlet/search.main",
    "PATCH /outlet/{id}": "packages/functions/src/outlet/update.main",
    "DELETE /outlet/{id}": "packages/functions/src/outlet/remove.main",
}

// HomeMaster routes -do not modify this plop comment-
const home_master = {
    "GET /home_master": "packages/functions/src/home_master/list.main",
    "GET /home_master/{id}": "packages/functions/src/home_master/get.main",
    "POST /home_master": "packages/functions/src/home_master/create.main",
    "POST /home_master/search": "packages/functions/src/home_master/search.main",
    "PATCH /home_master/{id}": "packages/functions/src/home_master/update.main",
    "DELETE /home_master/{id}": "packages/functions/src/home_master/remove.main",
}

// EquipmentType routes -do not modify this plop comment-
const equipment_type = {
    "GET /equipment_type": "packages/functions/src/equipment_type/list.main",
    "GET /equipment_type/{id}": "packages/functions/src/equipment_type/get.main",
    "POST /equipment_type": "packages/functions/src/equipment_type/create.main",
    "POST /equipment_type/search": "packages/functions/src/equipment_type/search.main",
    "PATCH /equipment_type/{id}": "packages/functions/src/equipment_type/update.main",
    "DELETE /equipment_type/{id}": "packages/functions/src/equipment_type/remove.main",
}

// Equipment routes -do not modify this plop comment-
const equipment = {
    "GET /equipment": "packages/functions/src/equipment/list.main",
    "GET /equipment/{id}": "packages/functions/src/equipment/get.main",
    "POST /equipment": "packages/functions/src/equipment/create.main",
    "POST /equipment/search": "packages/functions/src/equipment/search.main",
    "PATCH /equipment/{id}": "packages/functions/src/equipment/update.main",
    "DELETE /equipment/{id}": "packages/functions/src/equipment/remove.main",
}

// Component routes -do not modify this plop comment-
const component = {
    "GET /component": "packages/functions/src/component/list.main",
    "GET /component/{id}": "packages/functions/src/component/get.main",
    "POST /component": "packages/functions/src/component/create.main",
    "POST /component/search": "packages/functions/src/component/search.main",
    "PATCH /component/{id}": "packages/functions/src/component/update.main",
    "DELETE /component/{id}": "packages/functions/src/component/remove.main",
}

// BotVersion routes -do not modify this plop comment-
const bot_version = {
    "GET /bot_version": "packages/functions/src/bot_version/list.main",
    "GET /bot_version/{id}": "packages/functions/src/bot_version/get.main",
    "POST /bot_version": "packages/functions/src/bot_version/create.main",
    "POST /bot_version/search": "packages/functions/src/bot_version/search.main",
    "PATCH /bot_version/{id}": "packages/functions/src/bot_version/update.main",
    "DELETE /bot_version/{id}": "packages/functions/src/bot_version/remove.main",
}

// BotScheduledAlerts routes -do not modify this plop comment-
const bot_scheduled_alerts = {
    "GET /bot_scheduled_alerts": "packages/functions/src/bot_scheduled_alerts/list.main",
    "GET /bot_scheduled_alerts/{id}": "packages/functions/src/bot_scheduled_alerts/get.main",
    "POST /bot_scheduled_alerts": "packages/functions/src/bot_scheduled_alerts/create.main",
    "POST /bot_scheduled_alerts/search": "packages/functions/src/bot_scheduled_alerts/search.main",
    "PATCH /bot_scheduled_alerts/{id}": "packages/functions/src/bot_scheduled_alerts/update.main",
    "DELETE /bot_scheduled_alerts/{id}": "packages/functions/src/bot_scheduled_alerts/remove.main",
}

// BotFirmware routes -do not modify this plop comment-
const bot_firmware = {
    "GET /bot_firmware": "packages/functions/src/bot_firmware/list.main",
    "GET /bot_firmware/{id}": "packages/functions/src/bot_firmware/get.main",
    "POST /bot_firmware": "packages/functions/src/bot_firmware/create.main",
    "POST /bot_firmware/search": "packages/functions/src/bot_firmware/search.main",
    "PATCH /bot_firmware/{id}": "packages/functions/src/bot_firmware/update.main",
    "DELETE /bot_firmware/{id}": "packages/functions/src/bot_firmware/remove.main",
}

// BotComponent routes -do not modify this plop comment-
const bot_component = {
    "GET /bot_component": "packages/functions/src/bot_component/list.main",
    "GET /bot_component/{id}": "packages/functions/src/bot_component/get.main",
    "POST /bot_component": "packages/functions/src/bot_component/create.main",
    "POST /bot_component/search": "packages/functions/src/bot_component/search.main",
    "PATCH /bot_component/{id}": "packages/functions/src/bot_component/update.main",
    "DELETE /bot_component/{id}": "packages/functions/src/bot_component/remove.main",
}

// BotCompany routes -do not modify this plop comment-
const bot_company = {
    "GET /bot_company": "packages/functions/src/bot_company/list.main",
    "GET /bot_company/{id}": "packages/functions/src/bot_company/get.main",
    "POST /bot_company": "packages/functions/src/bot_company/create.main",
    "POST /bot_company/search": "packages/functions/src/bot_company/search.main",
    "PATCH /bot_company/{id}": "packages/functions/src/bot_company/update.main",
    "DELETE /bot_company/{id}": "packages/functions/src/bot_company/remove.main",
}

// BotChargingSettings routes -do not modify this plop comment-
const bot_charging_settings = {
    "GET /bot_charging_settings": "packages/functions/src/bot_charging_settings/list.main",
    "GET /bot_charging_settings/{id}": "packages/functions/src/bot_charging_settings/get.main",
    "POST /bot_charging_settings": "packages/functions/src/bot_charging_settings/create.main",
    "POST /bot_charging_settings/search": "packages/functions/src/bot_charging_settings/search.main",
    "PATCH /bot_charging_settings/{id}": "packages/functions/src/bot_charging_settings/update.main",
    "DELETE /bot_charging_settings/{id}": "packages/functions/src/bot_charging_settings/remove.main",
}

// BotAlert routes -do not modify this plop comment-
const bot_alert = {
    "GET /bot_alert": "packages/functions/src/bot_alert/list.main",
    "GET /bot_alert/{id}": "packages/functions/src/bot_alert/get.main",
    "POST /bot_alert": "packages/functions/src/bot_alert/create.main",
    "POST /bot_alert/search": "packages/functions/src/bot_alert/search.main",
    "PATCH /bot_alert/{id}": "packages/functions/src/bot_alert/update.main",
    "DELETE /bot_alert/{id}": "packages/functions/src/bot_alert/remove.main",
}

// AppSettingsType routes -do not modify this plop comment-
const app_settings_type = {
    "GET /app_settings_type": "packages/functions/src/app_settings_type/list.main",
    "GET /app_settings_type/{id}": "packages/functions/src/app_settings_type/get.main",
    "POST /app_settings_type": "packages/functions/src/app_settings_type/create.main",
    "POST /app_settings_type/search": "packages/functions/src/app_settings_type/search.main",
    "PATCH /app_settings_type/{id}": "packages/functions/src/app_settings_type/update.main",
    "DELETE /app_settings_type/{id}": "packages/functions/src/app_settings_type/remove.main",
}

// AppInstallPermissions routes -do not modify this plop comment-
const app_install_permissions = {
    "GET /app_install_permissions": "packages/functions/src/app_install_permissions/list.main",
    "GET /app_install_permissions/{id}": "packages/functions/src/app_install_permissions/get.main",
    "POST /app_install_permissions": "packages/functions/src/app_install_permissions/create.main",
    "POST /app_install_permissions/search": "packages/functions/src/app_install_permissions/search.main",
    "PATCH /app_install_permissions/{id}": "packages/functions/src/app_install_permissions/update.main",
    "DELETE /app_install_permissions/{id}": "packages/functions/src/app_install_permissions/remove.main",
}

// AppInstall routes -do not modify this plop comment-
const app_install = {
    "GET /app_install": "packages/functions/src/app_install/list.main",
    "GET /app_install/{id}": "packages/functions/src/app_install/get.main",
    "POST /app_install": "packages/functions/src/app_install/create.main",
    "POST /app_install/search": "packages/functions/src/app_install/search.main",
    "PATCH /app_install/{id}": "packages/functions/src/app_install/update.main",
    "DELETE /app_install/{id}": "packages/functions/src/app_install/remove.main",
}

// BotUser routes -do not modify this plop comment-
const bot_user = {
    "GET /bot_user": "packages/functions/src/bot_user/list.main",
    "GET /bot_user/{id}": "packages/functions/src/bot_user/get.main",
    "POST /bot_user": "packages/functions/src/bot_user/create.main",
    "POST /bot_user/search": "packages/functions/src/bot_user/search.main",
    "PATCH /bot_user/{id}": "packages/functions/src/bot_user/update.main",
    "DELETE /bot_user/{id}": "packages/functions/src/bot_user/remove.main",
}

// DO NOT REMOVE THIS LINE: PLOP ROUTE DEFINITION              

export default [
    bot,
    customer,
    company,
    alert_type,
    user_role,
    user_phone,
    user_email,
    user,
    universal_app_settings,
    state_master,
    scheduled_alert,
    role,
    permission,
    outlet_type,
    outlet_schedule,
    outlet_equipment,
    outlet,
    home_master,
    equipment_type,
    equipment,
    component,
    bot_version,
    bot_scheduled_alerts,
    bot_firmware,
    bot_component,
    bot_company,
    bot_charging_settings,
    bot_alert,
    app_settings_type,
    app_install_permissions,
    app_install,
    bot_user,
// DO NOT REMOVE THIS LINE: PLOP ROUTE IMPORT
];