import http from "@/lib/http";
import { logger } from "@/lib/logger";
import type { IResponse } from "@/utils/types";

export const getSalaries = async (data: string): Promise<IResponse> => {
  try {
    const urlParams = new URLSearchParams(data).toString();
    const url = urlParams ? `/api/catalogs/salaries?${urlParams}` : "/api/catalogs/salaries";

    const response = await http.get<IResponse>(url);
    return response.data;
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return error;
  }
};

export const getSalaryByCategoryAndEmployeeType = async (
  categoryId: string,
  employeeTypeId: string,
): Promise<IResponse> => {
  try {
    const url = `/api/catalogs/salaries/byCategoryAndEmployeeType?categoryId=${categoryId}&employeeTypeId=${employeeTypeId}`;
    const response = await http.get<IResponse>(url);
    return response.data;
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return error;
  }
};
