import http from "@/lib/http";
import type { IResponse } from "@/utils/types";

type CreateEmployeeHiringTerminatePayload = {
  employeeHiringId: number;
  terminationDate: string;
  reason?: string;
  comments?: string;
};

type CreateEmployeeHiringPayload = {
  employeeId: number;
  startJobDate: string;
  endJobDate?: string | null;
  categoryId: number;
  employeeTypeId: number;
  direccionId: number;
};

export const createEmployeeHiringTerminate = async (data: CreateEmployeeHiringTerminatePayload): Promise<IResponse> => {
  try {
    const response = await http.post<IResponse>("/api/employee-hiring/terminate/create", data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || error?.error || "Error al terminar el contrato",
      responseObject: error?.responseObject || {},
      statusCode: error?.statusCode || 500,
    } as IResponse;
  }
};

export const createEmployeeHiring = async (data: CreateEmployeeHiringPayload): Promise<IResponse> => {
  try {
    const response = await http.post<IResponse>("/api/employee-hiring/create", data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || error?.error || "Error al crear el contrato",
      responseObject: error?.responseObject || {},
      statusCode: error?.statusCode || 500,
    } as IResponse;
  }
};
