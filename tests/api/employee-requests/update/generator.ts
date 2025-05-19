import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import type { IEmployeeRequestUpdate } from "@/app/api/employee-requests/types";

export const generator = {
  request: (overrides?: Partial<IEmployeeRequestUpdate>): IEmployeeRequestUpdate => ({
    requestId: overrides?.requestId !== undefined ? overrides?.requestId : 1,
    status: overrides?.status !== undefined ? overrides?.status : "approved",
    approvedBy: overrides?.approvedBy !== undefined ? overrides?.approvedBy : 1,
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
