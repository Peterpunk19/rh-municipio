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

export const updateEmployee = async (employeeId: number, data: object): Promise<IResponse> => {
  try {
    const response = await http.put<IResponse>(`/api/employees/${employeeId}`, data);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const getEmployeeJobSchedule = async (employeeId: number) => {
  try {
    const response = await fetch(`/api/employees/${employeeId}/job-schedule`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching employee job schedule:", error);
  }
};

export const getEmployeeJobScheduleCalendar = async (employeeId: number, from: string, to: string) => {
  try {
    const response = await fetch(`/api/employees/${employeeId}/job-schedule-calendar?from=${from}&to=${to}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching employee job schedule:", error);
  }
};
