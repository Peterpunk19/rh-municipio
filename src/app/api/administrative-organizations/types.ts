export interface ICreateUpdateLeader {
  direccionId: number;
  director: number;
  secretary?: number;
  coordinator?: number;
  immediateResponsible?: number;
  startDate: string;
  endDate: string;
  signIncidentsRole: number;
  signRequestsRole: number;
  createdById: number;
}

export interface ILeaderRole {
  roleId: number;
  employeeId: number;
  signIncidents: boolean;
  signRequests: boolean;
}

export interface ICreateLeader extends Omit<ILeaderRole, "signIncidents" | "signRequests"> {
  direccionId: number;
  startDate: string;
  endDate: string;
  createdById: number;
}

export interface ICreateLeadersParams {
  direccionId: number;
  startDate: string;
  endDate: string;
  createdById: number;
  roles: ILeaderRole[];
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
