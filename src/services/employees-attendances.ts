import http from "@/lib/http";
import type { IResponse } from "@/utils/types";

export const createEmployeeAttendance = async (data: any): Promise<IResponse> => {
  try {
    const response = await http.post<IResponse>("/api/employee-attendance/create", data);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const getEmployeesAttendances = async (data: {}): Promise<IResponse> => {
  try {
    const urlParams = new URLSearchParams(data).toString();
    const url = urlParams ? `/api/employee-attendance?${urlParams}` : "/api/employee-attendance";

    const response = await http.get<IResponse>(url);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const getEmployeeAttendanceById = async (id: string): Promise<IResponse> => {
  try {
    const response = await http.get<IResponse>(`/api/employee-attendance/${id}`);
    return response.data;
  } catch (error: any) {
    return error;
  }
};
