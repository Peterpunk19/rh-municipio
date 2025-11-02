import http from "@/lib/http";
import type { IResponse } from "@/utils/types";

export const getEmployeesPayroll = async (data: {}): Promise<IResponse> => {
  try {
    const urlParams = new URLSearchParams(data).toString();
    const url = urlParams ? `/api/employee-payroll?${urlParams}` : "/api/employee-payroll";

    const response = await http.get<IResponse>(url);
    return response.data;
  } catch (error: any) {
    return error;
  }
};
