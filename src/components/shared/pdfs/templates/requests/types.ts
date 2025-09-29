import { Style } from "@react-pdf/types";
import { ChangeSchedule, ChangeAttendance, ChangeScheduleAttendance, ChangeAdscription } from ".";
import { REQUEST_TYPES_NAME } from "@/common/constants/RequestTypes";

export const REQUEST_COMPONENTS = {
  [REQUEST_TYPES_NAME.SCHEDULE]: ChangeSchedule,
  [REQUEST_TYPES_NAME.ATTENDANCE]: ChangeAttendance,
  [REQUEST_TYPES_NAME.SCHEDULE_ATTENDANCE]: ChangeScheduleAttendance,
  [REQUEST_TYPES_NAME.ADSCRIPTION]: ChangeAdscription,
  [REQUEST_TYPES_NAME.LOCATION]: ChangeSchedule,
  [REQUEST_TYPES_NAME.FINGERPRINT]: ChangeSchedule,
  [REQUEST_TYPES_NAME.RELEASE]: ChangeSchedule,
  [REQUEST_TYPES_NAME.UNION_LEAVE]: ChangeSchedule,
};

export interface RequestTemplateData {
  folio: string;
  request_date: string;
  created_at: string;
  employee: {
    name: string;
    paternal_last_name: string;
    maternal_last_name: string;
    number_employee: string;
    rfc: string;
    curp: string;
    employee_hiring: Array<{
      direccion?: {
        display_name: string;
        secretaria?: {
          display_name: string;
        };
        director?: {
          name: string;
          paternal_last_name: string;
          maternal_last_name: string;
        };
      };
      employee_type?: {
        display_name: string;
      };
      category?: {
        display_name: string;
      };
    }>;
    job_schedule_employee: Array<{
      start_day: {
        display_name: string;
      };
      end_day: {
        display_name: string;
      };
      start_hour: {
        display_name: string;
      };
      end_hour: {
        display_name: string;
      };
    }>;
    employee_attendance_type: {
      attendance: {
        display_name: string;
      };
    };
  };
  request: {
    name: string;
    display_name: string;
  };
  description?: string;
  // Nuevos campos dinámicos
  rhDirector?: {
    id: number;
    name: string;
    paternal_last_name: string;
    maternal_last_name: string;
  } | null;
  signatory?: {
    employee: {
      id: number;
      name: string;
      paternal_last_name: string;
      maternal_last_name: string;
    };
    role_id: number;
    role: {
      name: string;
      display_name: string;
    };
  } | null;
  vobo?: {
    employee: {
      id: number;
      name: string;
      paternal_last_name: string;
      maternal_last_name: string;
    };
    role_id: number;
    role: {
      name: string;
      display_name: string;
    };
  } | null;
  destinationDirector?: {
    id: number;
    name: string;
    paternal_last_name: string;
    maternal_last_name: string;
  } | null;
  changeDate?: string | null;
  requestDetail?: {
    id: number;
    start_date: Date | null;
    end_date: Date | null;
    new_direccion: {
      id: number;
      name: string;
      display_name: string;
      secretaria: {
        id: number;
        name: string;
        display_name: string;
      };
    } | null;
    location: {
      id: number;
      name: string;
      display_name: string;
    } | null;
    schedule: Array<{
      id: number;
      start_day: any;
      end_day: any;
      start_hour: any;
      end_hour: any;
    }> | null;
    prevSchedule: Array<{
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
    }> | null;
  } | null;
  // Legacy para compatibilidad
  currentDirector?: {
    name: string;
    paternal_last_name: string;
    maternal_last_name: string;
  };
}

export interface RequestTemplateProps {
  data: RequestTemplateData;
  type: "director" | "employee";
  styles?: {
    [key: string]: Style; // Permite cualquier propiedad de estilo
  };
}
