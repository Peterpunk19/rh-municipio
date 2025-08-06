import { HttpMessages } from "@/common/response/messages";

export const generator = {
  request: (overrides?: Partial<any>): any => ({
    employeeId: overrides?.employeeId ?? 1,
    incidentId: overrides?.incidentId ?? 1,
    startDate: overrides?.startDate ?? "2025-07-01",
    endDate: overrides?.endDate ?? "2025-07-10",
    ...overrides,
  }),
  response: (overrides?: Partial<any>): any => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? {},
    statusCode: overrides?.statusCode ?? 400,
    ...overrides,
  }),
};
