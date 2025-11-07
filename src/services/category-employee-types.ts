import http from "@/lib/http";
import { logger } from "@/lib/logger";
import type { IResponse } from "@/utils/types";

export interface CategoryEmployeeTypePayload {
  category_id: number;
  employee_type_id: number;
  salary: number | null;
  config_year_id: number;
}

export const getByYear = async (year: number, categoryId?: number | null): Promise<IResponse> => {
  try {
    const params = new URLSearchParams();
    params.append("year", year.toString());
    if (categoryId) {
      params.append("categoryId", categoryId.toString());
    }

    const response = await http.get<IResponse>(`/api/catalogs/salaries/by-year?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return error;
  }
};

export const update = async (id: number, payload: CategoryEmployeeTypePayload): Promise<IResponse> => {
  try {
    const response = await http.put<IResponse>(`/api/category-employee-types/${id}`, payload);
    return response.data;
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return error;
  }
};

export const create = async (payload: CategoryEmployeeTypePayload): Promise<IResponse> => {
  try {
    const response = await http.post<IResponse>(`/api/category-employee-types`, payload);
    return response.data;
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return error;
  }
};
