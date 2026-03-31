import http from "@/lib/http";
import type { IResponse } from "@/utils/types";

export const createBulkEmployeeIncidents = async (data: object): Promise<IResponse> => {
  try {
    const response = await http.post<IResponse>("/api/employee-incidents/bulk-create", data);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

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

export const updateEmployeeIncident = async (data: object): Promise<IResponse> => {
  try {
    const response = await http.put<IResponse>("/api/employee-incidents/update", data);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const getEmployeeIncidentById = async (
  id: string,
  isPDF?: boolean,
  incidentDate?: string,
): Promise<IResponse> => {
  try {
    let url = `/api/employee-incidents/${id}`;

    if (isPDF && incidentDate) {
      const params = new URLSearchParams({
        isPDF: isPDF.toString(),
        incidentDate: incidentDate,
      });
      url += `?${params.toString()}`;
    }

    const response = await http.get<IResponse>(url);
    return response.data;
  } catch (error: any) {
    return error;
  }
};
