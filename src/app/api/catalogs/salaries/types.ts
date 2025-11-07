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

export interface CategoryEmployeeTypeResult {
  categories: Array<{
    id: number;
    name: string;
    display_name: string;
  }>;
  employeeTypes: Array<{
    id: number;
    name: string;
    display_name: string;
  }>;
  data: Array<{
    id: number | null;
    category_id: number;
    employee_type_id: number;
    salary: any;
    config_year_id: number;
  }>;
}
