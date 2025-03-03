import http from "@/lib/http";
import type { IResponse, IResponseObject } from "@/utils/types";

export const createEmployee = async (data: object): Promise<IResponse> => {
  try {
    const response = await http.post<IResponse>("/api/employees/create", data);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const getEmployees = async (data: string): Promise<IResponse> => {
  try {
    const urlParams = new URLSearchParams(data).toString();
    let url = "/api/employees";
    if (urlParams.length > 0) {
      url = `${url}?${urlParams}`;
    }
    const response = await http.get<IResponse>(url);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const getEmployeeById = async (id: string): Promise<IResponse> => {
  const url = `/api/employees/${id}`;
  const response = await http.get<IResponse>(url);
  return response.data;
};
