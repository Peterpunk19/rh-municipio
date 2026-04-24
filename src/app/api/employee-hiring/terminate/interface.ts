export interface ITerminateEmployeeHiring {
  employeeHiringId: number;
  terminationDate: Date;
  reason?: string;
  comments?: string;
}
