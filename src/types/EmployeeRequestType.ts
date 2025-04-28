export interface EmployeeRequestType {
  id: string;
  folio: string;
  employee: {
    id: string;
    name: string;
    paternal_last_name: string;
    maternal_last_name: string;
    number_employee: string;
    rfc: string;
    curp: string;
  };
  request: {
    id: string;
    display_name: string;
  };
  request_status: {
    id: string;
    display_name: string;
  };
  request_date: string;
  created_at: string;
  updated_at: string;
}
