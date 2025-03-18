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

export const createEmployeeIncident = async (data: object): Promise<IResponse> => {
  try {
    const response = await http.post<IResponse>("/api/employee-incidents/create", data);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const getEmployeeIncidentById = async (id: string): Promise<IResponse> => {
  try {
    const response = await http.get<IResponse>(`/api/employee-incidents/${id}`);
    return response.data;
  } catch (error: any) {
    return error;
  }
};
