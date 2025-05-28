export interface IEmployeeHiring {
  id: number;
}

export interface IEmployeeLocation {
  id: number;
}

export interface IEmployeeAttendanceType {
  id: number;
}

export interface IEmployee {
  id: number;
  employee_hiring: IEmployeeHiring[];
  employee_location: IEmployeeLocation[];
  employee_attendance_type: IEmployeeAttendanceType[];
}
