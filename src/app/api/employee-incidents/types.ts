export interface IEmployeeIncident {
  folio: string;
  oficio?: string | null;
  employeeId: number | string;
  incidentId: number | string;
  incidentStatusId?: number;
  startDate: string;
  endDate: string;
  description: string;
  employeeAttendanceId?: number;
}
