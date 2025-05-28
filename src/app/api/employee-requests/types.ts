export interface IEmployeeScheduleRequest {
  startDayId: number | null;
  endDayId: number | null;
  startHourId: number | null;
  endHourId: number | null;
}

export interface IEmployeeRequest {
  folio: string;
  oficio?: string | null;
  description: string;
  requestId: number;
  employeeId: number;
  requestStatusId: number;
  requestDate: string;
  schedule?: IEmployeeScheduleRequest[];
  locationId?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  attendanceId?: number | null;
  attendanceDate?: string | null;
  requestedById: number;
}

export interface IEmployeeRequestsFilters {
  page: number | string;
  limit: number | string;
  employee_id: number | string | undefined;
  request_id?: number | string | null | undefined;
  request_status_id?: number | string | null | undefined;
  created_at?: string | null | undefined;
  request_date?: string | null | undefined;
  search?: string | null | undefined;
}

export interface IRequestValidation {
  id: string;
  service: (id: number) => Promise<any>;
  message: string;
}

export interface IRequestValidations {
  [key: string]: IRequestValidation[];
}

export interface IEmployeeRequestById {
  id: number | string;
  requestStatusId: number | string;
  employee?: {
    id: number;
    employee_hiring: { id: number }[];
    employee_location: { id: number }[];
  };
  createdById?: number;
}

export interface IEmployeeRequestUpdate {
  requestId: number;
  statusId?: number;
}
export interface IEmployeeRequestUpdateService {
  employeeRequestFound: IEmployeeRequestResponse;
  requestId: number;
  statusId: number;
  approvedBy: number;
}

export interface IEmployeeRequestResponse {
  id: number;
  folio: string;
  oficio: string | null;
  justification: string;
  created_at: Date | null;
  request_id: number;
  request_status: {
    id: number;
    name: string;
    display_name: string;
    btn_display_name: string;
    btn_icon: string;
    btn_color: string;
  };
  employee: {
    id: number;
    name: string;
    employeeNumber: string;
    rfc: string;
    curp: string;
    publicOrganization: string;
    administrativeOrganization: string;
    category: string | undefined;
  };
  request: {
    id: number;
    name: string;
    display_name: string;
  };
  request_details: {
    start_at?: Date | null;
    end_at?: Date | null;
    schedule?: {
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
    }[];
    attendance_date?: string;
    current_attendance?: {
      id: number;
      name: string;
      display_name: string;
    } | null;
    new_attendance?: {
      id: number;
      name: string;
      display_name: string;
    } | null;
    current_location?: {
      id: number;
      name: string;
      display_name: string;
    } | null;
    new_location?: {
      id: number;
      name: string;
      display_name: string;
    } | null;
    location?: {
      id: number;
      name: string;
      display_name: string;
    };
    request_date: Date | null;
  };
  requestedBy: {
    id: number;
    username: string;
  };
  approvedBy: {
    id: number;
    name: string;
    paternal_last_name: string;
    maternal_last_name: string;
  } | null;
  employee_attendance_status: {
    id: number;
    created_at: Date | null;
    created_by: {
      name: string;
      id: number;
      paternal_last_name: string;
      maternal_last_name: string;
    };
    request_status: {
      name: string;
      id: number;
      display_name: string;
      btn_display_name: string;
      btn_icon: string;
      btn_color: string;
    };
  }[];
}
