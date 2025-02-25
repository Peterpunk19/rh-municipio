import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import type { IEmployeeIncidentFilters } from "@/app/api/employee-incidents/types";

export const generator = {
  request: (overrides?: Partial<IEmployeeIncidentFilters>): IEmployeeIncidentFilters => ({
    page: overrides?.page ?? 1,
    limit: overrides?.limit ?? 5,
    search: overrides?.search ?? "",
    start_date: overrides?.start_date ?? "",
    end_date: overrides?.end_date ?? "",
    incident_id: overrides?.incident_id ?? "",
    incident_status_id: overrides?.incident_status_id ?? "",
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
