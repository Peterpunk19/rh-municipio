export interface IEmployee {
  numberEmployee: string;
  name: string;
  paternalLastName: string;
  maternalLastName: string;
  birthday: string;
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
  endJobDate: string;
  categoryId: number | string;
  employeeTypeName: string;
  tradeUnionId?: number | null;
  employeeTypeId?: number | string;
  direccionId: number | string;
  maritalStatusId: number | string;
  schoolingId: number | string;
  professionId: number | string;
  occupationId: number | string;
  identificationTypeId: number | string;
  identificationFolio: string | null;
  employeeHiringId?: number | string;
  employeeAddressId?: number | string;
  userId?: number;
  employeeId?: number;
}

export interface IEmployeeFilters {
  page: number;
  limit: number;
  gender: number | null | undefined;
  employee_type: number | null | undefined;
  active: string | boolean | null | undefined;
  employee_status: number | null | undefined;
  location: number | null | undefined;
  category: number | null | undefined;
  direccion: number | null | undefined;
  secretaria: number | null | undefined;
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
