import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import { IEmployeeAttendanceBulkImport } from "@/app/api/employee-attendance/types";

export const generator = {
  request: (overrides?: Partial<IEmployeeAttendanceBulkImport>): IEmployeeAttendanceBulkImport =>
    <IEmployeeAttendanceBulkImport>[
      {
        id: overrides?.id ?? 1,
        numberEmployee: overrides?.numberEmployee ?? "107991",
        isEntry: overrides?.isEntry ?? 1,
        dateTime: overrides?.dateTime ?? "2025-11-18 08:30:09",
      },
    ],
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
