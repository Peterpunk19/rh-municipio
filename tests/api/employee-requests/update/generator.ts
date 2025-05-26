import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import type { IEmployeeRequestUpdate } from "@/app/api/employee-requests/types";

export const generator = {
  request: (overrides?: Partial<IEmployeeRequestUpdate>): IEmployeeRequestUpdate => ({
    requestId: overrides?.requestId !== undefined ? overrides?.requestId : 15,
    statusId: overrides?.statusId !== undefined ? overrides?.statusId : 2,
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
