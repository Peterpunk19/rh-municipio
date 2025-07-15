export interface IEmployeeAscription {
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
  user_id: number;
  employee_ascriptions: IEmployeeAscription[];
  employee_location: IEmployeeLocation[];
  employee_attendance_type: IEmployeeAttendanceType[];
}
