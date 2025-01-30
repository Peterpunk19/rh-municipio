export interface IEmployee {
  numberEmployee: string;
  name: string;
  paternalLastName: string;
  maternalLastName: string;
  birthday: string;
  rfc: string;
  curp: string;
  genderId: number | null;
  startJobDate: string;
  endJobDate: string;
  categoryId: number | null;
  employeeTypeId: number | null;
  departamentoId: number | null;
  payrollId: number | null;
  locationId: number | null;
}

export interface IEmployeeFilters {
  page: number;
  limit: number;
  active: string | boolean | null | undefined;
  status_employee_id: number | null | undefined;
  location_id: number | null | undefined;
  start_date: string | null | undefined;
  end_date: string | null | undefined;
  search: string | null | undefined;
}

export interface IEmployeeHiring {
  employeeId: number;
  startJobDate: string;
  endJobDate: string;
  categoryId: number;
  employeeTypeId: number;
  departamentoId: number;
  payrollId: number;
}
