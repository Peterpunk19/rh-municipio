import type { CategoryEmployeeTypePayload } from "@/services/category-employee-types";

export const genPayload = (overrides: Partial<CategoryEmployeeTypePayload> = {}): CategoryEmployeeTypePayload => ({
  category_id: 1,
  employee_type_id: 2,
  salary: 100.25,
  config_year_id: 3,
  ...overrides,
});

export const genId = (n = 10) => n;
export const genYear = (y = 2025) => y;
