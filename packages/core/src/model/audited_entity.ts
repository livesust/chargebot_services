export interface AuditedEntity {
    id?: number;
    created_by: string;
    created_date: Date;
    modified_by: string;
    modified_date: Date;
    deleted_by: string;
    deleted_date: Date;
  }