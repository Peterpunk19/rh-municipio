import type { IResponse } from "@/utils/types";
import { HttpMessages } from "@/common/response/messages";
import type { CategoryEmployeeTypePayload } from "@/services/category-employee-types";

export const YEAR = 2025;
export const CATEGORY_ID = 1;
export const EMPLOYEE_TYPE_ID = 2;
export const CONFIG_YEAR_ID = 3;

export const makePayload = (overrides: Partial<CategoryEmployeeTypePayload> = {}): CategoryEmployeeTypePayload => ({
  category_id: CATEGORY_ID,
  employee_type_id: EMPLOYEE_TYPE_ID,
  salary: 123.45,
  config_year_id: CONFIG_YEAR_ID,
  ...overrides,
});

export const makeGetByYearUrl = (year: number = YEAR) => `/api/catalogs/salaries/by-year?year=${year}`;
export const makePutUrl = (id: number) => `/api/category-employee-types/${id}`;
export const makePostUrl = () => `/api/category-employee-types`;

export const makeSuccessResponse = (responseObject: any): IResponse => ({
  success: true,
  message: HttpMessages.salaries.getSuccess,
  responseObject,
  statusCode: 200,
});

export const makeError = (message = "network error") => {
  const err: any = new Error(message);
  return err;
};
