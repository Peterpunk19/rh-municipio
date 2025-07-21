export interface ICreateUpdateLeader {
  direccionId: number;
  director: number;
  deputyDirector?: number;
  startDate: string;
  endDate: string;
  createdById: number;
}

export interface ICreateLeader {
  direccionId: number;
  employeeId: number;
  roleId: number;
  startDate: string;
  endDate: string;
  createdById: number;
}

export interface IAdministrativeOrganizationsFilters {
  page: number | string;
  limit: number | string;
  search: string | null | undefined;
}

export interface ILeadersFilters {
  page: number | string;
  limit: number | string;
  search: string | null | undefined;
  active: string | null | undefined;
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  direccionId: number | null | undefined;
  roleId: number | null | undefined;
}
