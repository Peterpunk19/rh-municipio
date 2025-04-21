export interface IEmployeeAttendance {
  checkIn: string;
  checkOut: string;
  employeeId: number | string;
  employeeHiringId: number;
  employeeLocationId: number;
  description: string;
  createdById: number;
  active: boolean;
}

export interface IEmployeeAttendanceFilters {
  page: number | string;
  limit: number | string;
  checkIn: string | null | undefined;
  checkOut: string | null | undefined;
  organismPublic: number | string | null | undefined;
  organismAdministrative: number | string | null | undefined;
  search: string | null | undefined;
}

export interface IEmployeeAttendanceById {
  id: number;
}
