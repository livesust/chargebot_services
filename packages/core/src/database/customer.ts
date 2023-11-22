import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";


export interface CustomerTable extends AuditedEntity {
  name: string;
  email?: string;
    first_order_date?: Date;
  }

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type Customer = Selectable<CustomerTable>
export type NewCustomer = Insertable<CustomerTable>
export type CustomerUpdate = Updateable<CustomerTable>
