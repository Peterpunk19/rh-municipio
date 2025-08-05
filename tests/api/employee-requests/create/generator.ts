import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import type { IEmployeeRequest } from "@/app/api/employee-requests/types";

export const generator = {
  request: (overrides?: Partial<IEmployeeRequest>): IEmployeeRequest => ({
    folio: overrides?.folio ?? "00001",
    oficio: overrides?.oficio ?? null,
    description:
      overrides?.description ??
      "Lorem ipsum dolor sit amet consectetur adipiscing elit, porttitor eros quisque enim mattis facilisi.",
    requestId: overrides?.requestId ?? 1,
    employeeId: overrides?.employeeId ?? 1,
    requestStatusId: overrides?.requestStatusId ?? 1,
    requestDate: overrides?.requestDate ?? "2025-03-25",
    requestedById: overrides?.requestedById ?? 1,
    ...(overrides?.requestId === 1 && {
      startDate: overrides?.startDate ?? "2025-03-25",
      endDate: overrides?.endDate ?? "2025-03-25",
      schedule: overrides?.schedule ?? [
        {
          startDayId: 1,
          startHourId: 17,
          endDayId: 5,
          endHourId: 33,
        },
        {
          startDayId: 6,
          startHourId: 17,
          endDayId: 7,
          endHourId: 29,
        },
      ],
    }),
    ...(overrides?.requestId === 2 && {
      startDate: overrides?.startDate ?? "2025-03-25",
      endDate: overrides?.endDate ?? "2025-03-25",
      locationId: overrides?.locationId ?? 1,
    }),
    ...(overrides?.requestId === 3 && {
      attendanceId: overrides?.attendanceId ?? 1,
      attendanceDate: overrides?.attendanceDate ?? "2025-03-25",
    }),
    ...(overrides?.requestId === 4 && {
      locationId: overrides?.locationId ?? 1,
    }),
    ...(overrides?.requestId === 5 && {
      startDate: overrides?.startDate ?? "2025-03-25",
      locationId: overrides?.locationId ?? 1,
      direccionId: overrides?.direccionId ?? 1,
    }),
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
