import http from "@/lib/http";
import type { IResponse } from "@/utils/types";
import { formatRequestData } from "@/utils/request-formatter";

export const createEmployeeRequest = async (data: any): Promise<IResponse> => {
  try {
    const formattedData = formatRequestData(data);
    console.log(JSON.stringify(formattedData));
    const response = await http.post<IResponse>("/api/employee-requests/create", formattedData);
    return response.data;
  } catch (error: any) {
    return error;
  }
};
