import http from "@/lib/http";
import type { IResponse } from "@/utils/types";

export const getEmployeesIncidents = async (data: string): Promise<IResponse> => {
  try {
    const urlParams = new URLSearchParams(data).toString();
    const url = urlParams ? `/api/employee-incidents?${urlParams}` : "/api/employee-incidents";

    const response = await http.get<IResponse>(url);
    return response.data;
  } catch (error: any) {
    return error;
  }
};
