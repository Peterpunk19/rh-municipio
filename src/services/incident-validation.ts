import http from "@/lib/http";
import type { IResponse } from "@/utils/types";

export interface IncidentValidationResponse {
  incident_id: number;
  employee_id: number;
  allowed_days: number;
  used_days: number;
  remaining_days: number;
  hasRules?: boolean;
}

export const validateIncidentDays = async (
  employeeId: string | number,
  incidentId: string | number,
  startDate?: string,
  endDate?: string,
): Promise<IResponse> => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const validStartDate = startDate || today;
    const validEndDate = endDate || today;

    const queryParams = [
      `employeeId=${encodeURIComponent(employeeId)}`,
      `incidentId=${encodeURIComponent(incidentId)}`,
      `startDate=${encodeURIComponent(validStartDate)}`,
      `endDate=${encodeURIComponent(validEndDate)}`,
    ].join("&");

    const response = await http.get<IResponse>(`/api/incident-rules/validate?${queryParams}`);

    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error al validar los días de incidencia",
      responseObject: null,
      statusCode: 500,
    };
  }
};
