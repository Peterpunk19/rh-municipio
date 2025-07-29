export interface IIncidentsRolesPermissionsFilters {
  page: number;
  limit: number;
  incidentId: number | string | undefined;
  roleId: number | string | undefined;
  search: string | null | undefined;
}

export interface IIncidentsRolesPermissionsById {
  id: number;
}

export interface IIncidentsRolesPermissionsUpdateStatus {
  can_create: boolean;
}
