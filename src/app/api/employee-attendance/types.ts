export interface IEmployeeAttendance {
  checkIn: string;
  checkOut: string;
  employeeId: number | string;
  employeeAscriptionId: number;
  employeeLocationId: number;
  employeeAttendanceTypeId: number;
  description: string;
  createdById: number;
  active: boolean;
}

export type IEmployeeAttendanceBulkImport = {
  id: number;
  numberEmployee: string;
  isEntry: number;
  dateTime: string;
}[];

export interface IEmployeeAttendanceFilters {
  page: number | string;
  limit: number | string;
  employeeId: number | string | undefined;
  checkIn: string;
  checkOut: string;
  typeAttendance: number | string | null | undefined;
  location: number | string | null | undefined;
  organismPublic: number | string | null | undefined;
  organismAdministrative: number | string | null | undefined;
  search: string | null | undefined;
}

export interface IEmployeeAttendanceById {
  id: number;
}
