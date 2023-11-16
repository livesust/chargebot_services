import { ColumnType, Generated } from 'kysely'

export interface AuditedEntity {
    id?: Generated<number>;
    // You can specify a different type for each operation (select, insert and
    // update) using the `ColumnType<SelectType, InsertType, UpdateType>`
    // wrapper. Here we define a column `created_by` that is selected as
    // a `string`, can optionally be provided as a `string` in inserts and
    // can never be updated:
    created_by: ColumnType<string, string | undefined, never>;
    created_date: ColumnType<Date, Date | undefined, never>;

    // only provided on updates and select
    modified_by: ColumnType<string, never, string>;
    modified_date: ColumnType<Date, never, Date>;

    // optionally provided on updates (when deleted) and select
    deleted_by: ColumnType<string, never, string | undefined>;
    deleted_date: ColumnType<Date, never, Date | undefined>;
  }