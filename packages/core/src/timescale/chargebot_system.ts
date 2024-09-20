import { ColumnType, Generated, Insertable, Selectable } from 'kysely';

export interface ChargebotSystemTable {
  id?: Generated<number>;
  device_id: ColumnType<string, string, never>;
  device_version: ColumnType<string, string, never>;
  timestamp: ColumnType<Date, Date, never>;
  timezone: ColumnType<string, string, never>;
  variable: ColumnType<string, string, never>;
  address?: ColumnType<string, never, never>;
  value?: ColumnType<unknown, unknown | undefined, never>;
  value_boolean?: ColumnType<boolean, boolean | undefined, never>;
  value_int?: ColumnType<number, number | undefined, never>;
  value_long?: ColumnType<number, number | undefined, never>;
  value_float?: ColumnType<number, number | undefined, never>;
  value_double?: ColumnType<number, number | undefined, never>;
  value_string?: ColumnType<string, string | undefined, never>;
  unit?: ColumnType<string, never, never>;
  data_type: ColumnType<string, string, never>;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type ChargebotSystem = Selectable<ChargebotSystemTable>
export type NewChargebotSystem = Insertable<ChargebotSystemTable>

export enum SystemVariables {
  CONNECTED = "connected",
  CPU = "cpu_percent",
  DISK = "disk",
  INET_CONNECTIONS = "inet_connections",
  MEMORY = "memory_info",
  NUM_THREADS = "num_threads",
  OPEN_FILES = "open_files",
  PROCESS_CONNECTIONS = "p_connections",
  PROCESS_CPU = "p_cpu_percent",
  PROCESS_MEMORY = "p_memory_info",
  TEMPERATURE = "temperature",
  THROTTLED = "throttled",
  UNVERVOLTAGE = "undervoltage",
  UPTIME_MINUTES = "uptime_minutes",
  VOLT_CORE = "volt_core",
  VOLT_SDRAM_C = "volt_sdram_c",
  VOLT_SDRAM_I = "volt_sdram_i",
  VOLT_SDRAM_P = "volt_sdram_p",
}
