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
