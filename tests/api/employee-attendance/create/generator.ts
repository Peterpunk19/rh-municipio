import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import { IEmployeeAttendance } from "@/app/api/employee-attendance/types";
import { getRandomDate } from "@/common/utils";

const checkInOut = getRandomDate(new Date("2000-01-01"), new Date("2025-01-01"));

export const generator = {
  request: (overrides?: Partial<IEmployeeAttendance>): IEmployeeAttendance =>
    <IEmployeeAttendance>{
      employeeId: overrides?.employeeId ?? 1,
      checkIn: overrides?.checkIn ?? checkInOut,
      checkOut: overrides?.checkOut ?? checkInOut,
      description: overrides?.description ?? "Carlos Ricardo",
    },
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
