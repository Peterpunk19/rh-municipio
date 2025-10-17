export interface IUser {
  username: string;
  uuid?: string;
  employee_id?: number;
  password: string;
  role_id: number;
  secretaria_id?: number | null;
  direcciones_ids?: number[] | null;
  created_by_id?: number;
  must_change_password?: boolean;
}

export interface IUserFilters {
  limit: number;
  page: number;
  role_id?: number | null | undefined;
  active?: string | boolean | null | undefined;
  search?: string | null | undefined;
}

export interface IUserById {
  id: number;
}

export interface IUserDeactivate {
  user_id: number;
}
