export interface Employee {
  id: number;
  name: string;
  active: boolean;
  created_at: Date | null;
  updated_at: Date | null;
  location_display_name?: string;
  number_employee?: string;
  paternal_last_name?: string;
  maternal_last_name?: string;
  rfc?: string;
  curp?: string;
  birthday?: Date;
  user_id?: number;
  status_employee_id?: number;
  gender_id?: number;
  gender_name?: string;
  marital_status_id?: number;
  schooling_id?: number;
  profession_id?: number;
  occupation_id?: number;
  identification_type_id?: number;
  trade_union_id?: number;
  identification_folio?: string;
}
