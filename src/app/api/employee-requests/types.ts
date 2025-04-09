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

export interface IRequestValidation {
  id: string;
  service: (id: number) => Promise<any>;
  message: string;
}

export interface IRequestValidations {
  [key: string]: IRequestValidation[];
}
