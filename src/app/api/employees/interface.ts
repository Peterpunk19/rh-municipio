export interface IEmployee {
  numberEmployee: string;
  name: string;
  paternalLastName: string;
  maternalLastName: string;
  birthday: string | null;
  rfc: string;
  curp: string;
  genderId: number | string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string | null;
  addressLine4: string;
  postalCode: string;
  postalCodeSat: string;
  municipalityId: number | string;
  startJobDate: string;
  endJobDate: string | null;
  categoryId: number | string | null;
  employeeTypeName: string;
  tradeUnionId?: number | string | null;
  employeeTypeId?: number | string | null;
  direccionId: number | string | null;
  maritalStatusId: number | string;
  schoolingId: number | string | null;
  professionId: number | string | null;
  occupationId: number | string | null;
  identificationTypeId: number | string;
  identificationFolio: string | null;
  employeeHiringId?: number | string;
  employeeAddressId?: number | string;
  userId?: number;
  employeeId?: number;
  stateId?: number | string;
  secretariaId?: number | null;
  id?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  statusEmployeeId?: number;
  directorId?: number | null;
  sustituteId?: number | null;
  salary?: string;
  direccionSecretariaId?: number | null;
  municipalityStateId?: number | null;
  countryId?: number | null;
  locationId?: number | null;
  attendanceId?: number | null;
}

export interface IEmployeeFilters {
  page: number;
  limit: number;
  number_employee: string | null;
  employee_id: number | null | undefined;
  gender: number | null | undefined;
  employee_type: number | null | undefined;
  active: string | boolean | null | undefined;
  employee_status: number | null | undefined;
  location: number | null | undefined;
  employeeAttendanceType: number | null | undefined;
  category: number | null | undefined;
  direccion: number | null | undefined;
  secretaria: number | null | undefined;
  trade_union: number | null | undefined;
  start_job_date_start: string | null | undefined;
  start_job_date_end: string | null | undefined;
  end_job_date_start: string | null | undefined;
  end_job_date_end: string | null | undefined;
  search: string | null | undefined;
}

export interface IEmployeeHiring {
  employeeId: number;
  startJobDate: string;
  endJobDate: string;
  categoryId: number;
  employeeTypeId: number;
  direccionId: number;
}

export interface IEmployeeById {
  id: number;
}

export interface IEmployeeLocation {
  employeeId: number;
  locationId: number;
  active: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface IEmployeeAttendanceType {
  employeeId: number;
  attendanceId: number;
  active: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}
