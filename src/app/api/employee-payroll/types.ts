export interface IEmployeePayroll {
  employeeId: number | string;
  employeeAscriptionId: number;
  active: boolean;
}

export interface IEmployeePayrollFilters {
  page: number | string;
  limit: number | string;
  search: string | null | undefined;
  from: string | null | undefined;
  to: string | null | undefined;
  employeeId: number | string | undefined;
  direccionId: number | string | undefined;
}
