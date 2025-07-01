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
  createdBy: number | string;
  incidentDates?: string[];
  direccionId?: number | null;
}

export interface IEmployeeIncidentFilters {
  page: number | string;
  limit: number | string;
  employee_id: number | string | undefined;
  incident_id: number | string | undefined;
  incident_status_id: number | string | undefined;
  start_date: string | null | undefined;
  end_date: string | null | undefined;
  search: string | null | undefined;
  direccion_id?: number | undefined;
}

export interface IEmployeeIncidentById {
  id: number | string;
  incidentStatusId: number | string;
  checkIn?: Date | string;
  checkOut?: Date | string;
  employee?: {
    id: number;
    employee_hiring: { id: number }[];
    employee_location: { id: number }[];
  };
  createdById?: number;
  validatedById?: number;
}

export interface IEmployeeIncidentUpdate {
  id: number | string;
  incidentStatusId: number;
  employeeId: number;
  employeeHiringId: number;
  employeeLocationId: number;
  checkIn: Date | string;
  checkOut: Date | string;
  createdById: number;
  employeeAttendanceTypeId: number;
  employeeIncidentDays: any;
  validatedById?: number;
}

export interface IncidentCreateModalProps {
  open: boolean;
  onClose: () => void;
  employeeId?: number | string;
  onSuccess?: () => void;
}
