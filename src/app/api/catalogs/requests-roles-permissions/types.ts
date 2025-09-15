export interface IRequestsRolesPermissionsFilters {
  page: number;
  limit: number;
  requestId: number | null;
  roleId: number | null;
  search: string | null;
}

export interface IRequestsRolesPermissionsById {
  id: number;
}

export interface IRequestsRolesPermissionsUpdateStatus {
  can_create: boolean;
}
