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
  createdBy: number | null;
  incidentDates: string[];
  incidentDatesWithPercentage?: { date: string; percentage: number }[];
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
    user_id: number;
    employee_hiring: { id: number }[];
    employee_location: { id: number }[];
    employee_ascriptions: { id: number }[];
    employee_attendance_type: { id: number }[];
  };
  start_date?: string | Date;
  end_date?: string | Date;
  incident_status_id?: number;
  employee_id?: number;
  employee_incident_days?: any[];
  createdById?: number;
  validatedById?: number;
}

export interface IEmployeeIncidentUpdate {
  id: number | string;
  incidentStatusId: number;
  employeeId: number;
  numberEmployee: string;
  employeeAscriptionId: number;
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

export interface IEmployeeIncidentGetById {
  id: number;
  folio: string;
  oficio: string;
  description: string;
  employee_id: number;
  incident_id: number;
  incident_status_id: number;
  start_date: string | Date;
  end_date: string | Date;
  active: boolean;
  created_at: Date;
  created_by_id: number;
  direccion_id?: number | null;
  created_by: {
    id: number;
    name: string;
    maternal_last_name: string;
    paternal_last_name: string;
  };
  validated_by_id?: number | null;
  validated_by?: {
    id: number;
    name: string;
    maternal_last_name: string;
    paternal_last_name: string;
  } | null;
  incident: {
    id: number;
    name: string;
    display_name: string;
    display_calendar_dates?: boolean;
  };
  incident_status: {
    id: number;
    name: string;
    display_name: string;
    btn_color: string;
    btn_display_name: string;
    btn_icon: string;
  };
  employee: {
    id: number;
    user_id: number;
    name: string;
    maternal_last_name: string;
    paternal_last_name: string;
    number_employee: string;
    rfc: string;
    curp: string;
    employee_ascriptions: Array<{
      id: number;
      direccion: {
        id: number;
        name: string;
        display_name: string;
        secretaria: {
          id: number;
          name: string;
          display_name: string;
        };
      };
    }>;
    employee_hiring: Array<{
      id: number;
      category: {
        id: number;
        name: string;
        display_name: string;
      };
      employee_type: {
        id: number;
        name: string;
        display_name: string;
      };
      direccion: {
        id: number;
        name: string;
        display_name: string;
        secretaria: {
          id: number;
          name: string;
          display_name: string;
        };
      };
    }>;
    employee_location: Array<{
      id: number;
      location: {
        id: number;
        name: string;
        display_name: string;
      };
    }>;
    employee_attendance_type: Array<{
      id: number;
    }>;
  };
  employee_incidents_status: Array<{
    id: number;
    created_at: Date;
    incident_status: {
      id: number;
      name: string;
      display_name: string;
      btn_color: string;
      btn_display_name: string;
      btn_icon: string;
    };
    created_by: {
      id: number;
      name: string;
      maternal_last_name: string;
      paternal_last_name: string;
    };
  }>;
  employee_incident_days: Array<{
    id: number;
    date: Date;
    created_at: Date;
  }>;
}

export interface IEmployeeIncidentsBulkCreate {
  employeeIds: number[];
  incidentId: number;
  startDate: Date;
  endDate: Date;
  description: string;
  oficio?: string | null;
  incidentDates?: string[];
  startHour?: number | null;
  endHour?: number | null;
}
