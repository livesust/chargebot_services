import { Insertable, Selectable, Updateable } from 'kysely'
import { AuditedEntity } from "./audited_entity";
import { Customer } from "./customer";
import { HomeMaster } from "./home_master";

export interface CompanyTable extends AuditedEntity {
  name: string;
  emergency_phone?: string;
  emergency_email?: string;
  customer_id: number;
  home_master_id: number;
  customer?: Customer;
  home_master?: HomeMaster;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type Company = Selectable<CompanyTable>
export type NewCompany = Insertable<CompanyTable>
export type CompanyUpdate = Updateable<CompanyTable>
