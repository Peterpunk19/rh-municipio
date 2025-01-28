import http from "@/lib/http";
import { IResponse } from "@/utils/types";

export const createEmployee = async (data: object): Promise<IResponse> => {
  try {
    const response = await http.post<IResponse>("/api/employees/create", data);
    return response.data;
  } catch (error: any) {
    return error;
  }
};
