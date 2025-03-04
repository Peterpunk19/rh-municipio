export interface IEmployeeAttendance {
  checkIn: string;
  checkOut: string;
  employeeId: number | string;
  employeeHiringId: number;
  employeeLocationId: number;
  description: string;
  createdById: number;
}
