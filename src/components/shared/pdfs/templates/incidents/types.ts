import { Style } from "@react-pdf/types";
import {
  DeathLeaveIncident,
  ExitJustificationIncident,
  IncapacityIncident,
  EconomicPermitIncident,
  PaternityIncident,
  LactationIncident,
  UnpaidLeaveIncident,
  CommissionIncident,
  EntryJustificationIncident,
  VacationIncident,
} from ".";
import { IncidentTypes } from "@/common/constants/IncidentTypes";

export const INCIDENT_COMPONENTS = {
  [IncidentTypes.INCAPACIDAD]: IncapacityIncident,
  [IncidentTypes.JUSTIFICACION_ENTRADA]: EntryJustificationIncident,
  [IncidentTypes.JUSTIFICACION_SALIDA]: ExitJustificationIncident,
  [IncidentTypes.JUSTIFICACION_ENTRADA_SALIDA]: ExitJustificationIncident,
  [IncidentTypes.LACTANCIA]: LactationIncident,
  [IncidentTypes.PATERNIDAD]: PaternityIncident,
  [IncidentTypes.PERMISO_ESPECIAL]: ExitJustificationIncident,
  [IncidentTypes.PERMISO_SIN_GOCE]: UnpaidLeaveIncident,
  [IncidentTypes.PERMISO_ECONOMICO]: EconomicPermitIncident,
  [IncidentTypes.VACACIONES]: VacationIncident,
  [IncidentTypes.COMISION]: CommissionIncident,
  [IncidentTypes.LICENCIA_FALLECIMIENTO]: DeathLeaveIncident,
};

export interface EmployeeHiring {
  direccion?: {
    display_name: string;
    secretaria?: {
      display_name: string;
    };
  };
  employee_type?: {
    display_name: string;
  };
}

export interface Employee {
  name: string;
  number_employee: string;
  paternal_last_name: string;
  maternal_last_name: string;
  rfc: string;
  employee_hiring: EmployeeHiring[];
  employee_location: Array<{
    location?: {
      display_name: string;
    };
  }>;
  job_schedule_employee: Array<{
    id: number;
    start_day: {
      id: number;
      name: string;
      display_name: string;
    };
    end_day: {
      id: number;
      name: string;
      display_name: string;
    };
    start_hour: {
      id: number;
      name: string;
      display_name: string;
    };
    end_hour: {
      id: number;
      name: string;
      display_name: string;
    };
  }>;
}

export interface IncidentData {
  incident?: {
    name: IncidentTypes;
    display_name: string;
    type: string;
  };
  start_date: string;
  end_date: string;
  fecha_deceso?: string;
  parentesco?: string;
  hora_salida?: string;
  hora_regreso?: string;
  description: string;
  oficio: string;
  folio: string;
  created_at: string;
  employee: Employee;
  jornada: string;
  entrada: string;
  salida: string;
  registro: string;
  fechaJustificar: string;
  employee_incident_days: Array<{
    id: number;
    date: string;
    created_at: string;
  }>;
}

export interface IncidentItemProps {
  data: IncidentData;
  styles: {
    row: Style;
    cell: Style;
    cellHeader: Style;
    uppercase: Style;
    italic: Style;
    lastCell: Style;
    lastRow: Style;
  };
}
