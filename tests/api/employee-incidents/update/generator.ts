import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import type { IEmployeeIncidentById } from "@/app/api/employee-incidents/types";

export const generator = {
  request: (overrides?: Partial<IEmployeeIncidentById>): IEmployeeIncidentById => ({
    id: overrides?.id !== undefined ? overrides?.id : 1,
    incidentStatusId: overrides?.incidentStatusId !== undefined ? overrides?.incidentStatusId : 1,
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
