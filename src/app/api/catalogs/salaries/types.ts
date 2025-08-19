export interface ISalariesFilters {
  page: number;
  limit: number;
  search: string | null | undefined;
  categoryId: number | string | undefined;
  employeeTypeId: number | string | undefined;
}

export interface ISalariesByCategoryAndEmployeeTypeFilters {
  categoryId: number | string | undefined;
  employeeTypeId: number | string | undefined;
}
