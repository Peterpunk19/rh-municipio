import http from "@/lib/http";
import type { IResponse } from "@/utils/types";

export const getEmployeeRequests = async (queryParams: string) => {
  try {
    const urlParams = new URLSearchParams(queryParams).toString();
    let url = "/api/employee-requests";
    if (urlParams.length > 0) {
      url = `${url}?${urlParams}`;
    }

    const response = await http.get<IResponse>(url);
    const requests = response.data.responseObject?.requests || [];
    const transformedResponse = {
      ...response.data,
      responseObject: {
        ...response.data.responseObject,
        data: requests,
      },
    };

    return transformedResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error al obtener solicitudes",
      responseObject: { data: [], total: 0 },
      statusCode: 500,
    };
  }
};

export const getEmployeeRequestById = async (id: string) => {
  try {
    const response = await http.get<IResponse>(`/api/employee-requests/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error al obtener detalles de la solicitud",
      responseObject: null,
      statusCode: 500,
    };
  }
};

export const createEmployeeRequest = async (data: any) => {
  try {
    const response = await http.post<IResponse>("/api/employee-requests", data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error al crear la solicitud",
      responseObject: null,
      statusCode: 500,
    };
  }
};

export const updateEmployeeRequest = async (data: any): Promise<IResponse> => {
  try {
    const response = await http.put<IResponse>("/api/employee-requests/update", data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error al actualizar la solicitud",
      responseObject: null,
      statusCode: 500,
    };
  }
};
