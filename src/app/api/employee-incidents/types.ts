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

export interface IEmployeeIncidentFilters {
  page: number | string;
  limit: number | string;
  incident_id: number | string | undefined;
  incident_status_id: number | string | undefined;
  start_date: string | null | undefined;
  end_date: string | null | undefined;
  search: string | null | undefined;
}
