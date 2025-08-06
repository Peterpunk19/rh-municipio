import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import type { IEmployeeIncident } from "@/app/api/employee-incidents/types";

export const generator = {
  request: (overrides?: Partial<IEmployeeIncident>): IEmployeeIncident => ({
    folio: overrides?.folio ?? "00001",
    oficio: overrides?.oficio ?? null,
    employeeId: overrides?.employeeId ?? 1,
    incidentId: overrides?.incidentId !== undefined ? overrides?.incidentId : 1,
    incidentStatusId: overrides?.incidentStatusId !== undefined ? overrides?.incidentStatusId : 1,
    startDate: overrides?.startDate ?? "2025-08-25",
    endDate: overrides?.endDate ?? "2025-08-29",
    description: overrides?.description ?? "Carlos Ricardo",
    createdBy: overrides?.createdBy ?? 1,
    incidentDates: overrides?.incidentDates ?? ["2025-08-25", "2025-08-26", "2025-08-27", "2025-08-28", "2025-08-29"],
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
