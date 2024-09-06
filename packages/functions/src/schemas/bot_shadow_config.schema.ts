import Joi from 'joi';

export const BotShadowConfigSchema = Joi.object({
  system: Joi.object({
    connected: Joi.boolean().allow(null),
    temperature: Joi.number().allow(null),
    cpu: Joi.string().allow(null),
    memory: Joi.string().allow(null),
    disk: Joi.string().allow(null),
    inet_connections: Joi.number().allow(null),
    p_memory: Joi.string().allow(null),
    p_cpu: Joi.string().allow(null),
    threads: Joi.number().allow(null),
    open_files: Joi.number().allow(null),
    open_connections: Joi.number().allow(null),
    undervoltage_count: Joi.number().allow(null),
    uptime_minutes: Joi.number().allow(null),
    throttled: Joi.string().allow(null),
    device_version: Joi.string().allow(null),
    device_id: Joi.string().allow(null),
  }).allow(null),

  config: Joi.object({
    hardware: Joi.object({

      gps: Joi.object({
        enabled: Joi.boolean().allow(null),
        model: Joi.string().allow(null),
        report_thresholds: Joi.object({
          time_minutes: Joi.number().allow(null),
          distance_miles: Joi.number().allow(null),
        }).allow(null),
      }).allow(null),

      fan: Joi.object({
        enabled: Joi.boolean().allow(null),
        model: Joi.string().allow(null),
        temperature: Joi.object({
          low_limit_celcius: Joi.number().allow(null),
          high_limit_celcius: Joi.number().allow(null),
        }).allow(null),
      }).allow(null),

      temperature_sensor: Joi.object({
        enabled: Joi.boolean().allow(null),
        model: Joi.string().allow(null),
      }).allow(null),

      pdu: Joi.object({
        enabled: Joi.boolean().allow(null),
        model: Joi.string().allow(null),
        number_of_outlets: Joi.number().allow(null),
        high_temperature_mode: Joi.object({
          low_limit_celcius: Joi.number().allow(null),
          high_limit_celcius: Joi.number().allow(null),
        }).allow(null),
        current_thresholds: Joi.object({
          low_current: Joi.number().allow(null),
          stop_priority_charge_mode: Joi.number().allow(null),
          stop_limited_mode: Joi.number().allow(null),
          start_limited_mode: Joi.number().allow(null),
          overload: Joi.number().allow(null),
        }).allow(null),
      }).allow(null),

      battery: Joi.object({
        enabled: Joi.boolean().allow(null),
        model: Joi.string().allow(null),
        soc_thresholds: Joi.object({
          low: Joi.number().allow(null),
          critical: Joi.number().allow(null),
          normalized: Joi.number().allow(null),
        }).allow(null),
        temperature_thresholds: Joi.object({
          low_celcius: Joi.number().allow(null),
          critical_celcius: Joi.number().allow(null),
        }).allow(null),
      }).allow(null),

      inverter: Joi.object({
        enabled: Joi.boolean().allow(null),
        model: Joi.string().allow(null),
        start_battery_charge_set_point: Joi.number().allow(null),
        stop_battery_charge_set_point: Joi.number().allow(null),
        slow_charge_max_ac_charger_current: Joi.number().allow(null),
        default_max_ac_charger_current: Joi.number().allow(null),
        grid_charging_balancing: Joi.array().items(Joi.object({
          load_amps_higher_equal_than: Joi.number().allow(null),
          load_amps_lower_than: Joi.number().allow(null),
          max_ac_charger_limit: Joi.number().allow(null),
        })).allow(null),
      }).allow(null),
    }).allow(null),

    system_usage: Joi.object({
      cpu_limit: Joi.number().allow(null),
      memory_limit: Joi.number().allow(null),
      disk_limit: Joi.number().allow(null),
      temperature: Joi.number().allow(null),
      core_voltage: Joi.number().allow(null),
    }).allow(null),
  
    home_location: Joi.object({
      latitude: Joi.number().allow(null),
      longitude: Joi.number().allow(null),
    }).allow(null),
  
    alerts: Joi.object({
      arrive_home: Joi.boolean().allow(null),
      leave_home: Joi.boolean().allow(null),
      long_stop: Joi.object({
        enabled: Joi.boolean().allow(null),
        time_period_hours: Joi.number().allow(null),
      }).allow(null),
      not_plugged_in: Joi.object({
        enabled: Joi.boolean().allow(null),
        time_to_send: Joi.string().allow(null),
        timezone: Joi.string().allow(null),
      }).allow(null),
      daily_use: Joi.object({
        enabled: Joi.boolean().allow(null),
        time_to_send: Joi.string().allow(null),
        timezone: Joi.string().allow(null),
      }).allow(null),
      nothing_charging: Joi.object({
        enabled: Joi.boolean().allow(null),
        time_to_send: Joi.string().allow(null),
        timezone: Joi.string().allow(null),
      }).allow(null),
      battery: Joi.object({
        soc_low: Joi.boolean().allow(null),
        soc_critical: Joi.boolean().allow(null),
        temperature_celcius_low: Joi.boolean().allow(null),
        temperature_celcius_critical: Joi.boolean().allow(null),
      }).allow(null)
    }).allow(null),
  }).allow(null),

  inverter: Joi.object({
    current_time_year: Joi.number().allow(null),
    current_time_month: Joi.number().allow(null),
    current_time_day: Joi.number().allow(null),
    current_time_hour: Joi.number().allow(null),
    current_time_minute: Joi.number().allow(null),
    current_time_second: Joi.number().allow(null),
    inv_output_priority: Joi.string().allow(null),
    inv_output_frequency: Joi.number().allow(null),
    inv_AC_input_voltage_range: Joi.string().allow(null),
    inv_charger_source_priority: Joi.string().allow(null),
    inv_max_charger_current: Joi.number().allow(null),
    inv_power_saving_mode: Joi.string().allow(null),
    inv_restart_when_over_load: Joi.string().allow(null),
    inv_restart_when_over_temperature: Joi.string().allow(null),
    inv_alarm_enable: Joi.string().allow(null),
    inv_alarm_beeps_while_primary_source_interrupted: Joi.string().allow(null),
    inv_bypass_output_when_over_load: Joi.string().allow(null),
    inv_max_ac_charger_current: Joi.number().allow(null),
    inv_split_phase: Joi.string().allow(null),
    inv_parallel_mode_setup: Joi.string().allow(null),
    inv_output_voltage: Joi.number().allow(null),
    batt_boost_charge_return_voltage: Joi.number().allow(null),
    version: Joi.number().allow(null),
  }).allow(null),
});
