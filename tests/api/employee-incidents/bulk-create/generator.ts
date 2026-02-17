import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import type { IEmployeeIncidentsBulkCreate } from "@/app/api/employee-incidents/types";

export const generator = {
  request: (overrides?: Partial<IEmployeeIncidentsBulkCreate>): IEmployeeIncidentsBulkCreate => ({
    employeeIds: overrides?.employeeIds ?? [1, 2, 3],
    incidentId: overrides?.incidentId ?? 1,
    startDate: overrides?.startDate ? new Date(overrides.startDate) : new Date("2025-08-25"),
    endDate: overrides?.endDate ? new Date(overrides.endDate) : new Date("2025-08-29"),
    description: overrides?.description ?? "Incidencia masiva de prueba",
    oficio: overrides?.oficio ?? null,
    incidentDates: overrides?.incidentDates ?? ["2025-08-25", "2025-08-26", "2025-08-27", "2025-08-28", "2025-08-29"],
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
