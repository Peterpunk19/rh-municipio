export interface ICreateEmployeeHiring {
  employeeId: number;
  startJobDate: string;
  endJobDate?: string | null;
  categoryId: number;
  employeeTypeId: number;
  direccionId: number;
}
