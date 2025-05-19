import { z } from "zod";
import { validationMessages } from "@/common/validation/messages";
import { validateDate } from "@/schemas/utils";

const EmployeeScheduleRequestSchema = z.object({
  startDayId: z
    .number({ message: validationMessages.required("Fecha de inicio") })
    .positive({ message: validationMessages.required("Fecha de inicio") }),
  startHourId: z
    .number({ message: validationMessages.required("Hora de inicio") })
    .positive({ message: validationMessages.required("Hora de inicio") }),
  endDayId: z
    .number({ message: validationMessages.required("Fecha de término") })
    .positive({ message: validationMessages.required("Fecha de término") }),
  endHourId: z
    .number({ message: validationMessages.required("Hora de término") })
    .positive({ message: validationMessages.required("Hora de término") }),
});

export const EmployeeRequestPostSchema = z
  .object({
    folio: z
      .string({ message: validationMessages.required("Folio") })
      .min(1, { message: validationMessages.required("Folio") })
      .max(10, { message: validationMessages.maxLength("Folio", 10) })
      .optional()
      .nullable(),
    oficio: z.string().optional().nullable(),
    description: z
      .string({ message: validationMessages.required("Descripción") })
      .min(10, { message: validationMessages.minLength("Descripción", 10) })
      .max(200, { message: validationMessages.maxLength("Descripción", 200) }),
    requestId: z
      .number({ message: validationMessages.required("Tipo de solicitud") })
      .positive({ message: validationMessages.required("Tipo de solicitud") }),
    employeeId: z
      .number({ message: validationMessages.required("Empleado") })
      .positive({ message: validationMessages.required("Empleado") }),
    requestStatusId: z
      .number({ message: validationMessages.required("Estatus") })
      .optional()
      .nullable(),
    schedule: z
      .array(EmployeeScheduleRequestSchema)
      .min(1, { message: validationMessages.oneItem("Horario") })
      .optional(),
    locationId: z
      .number({ message: validationMessages.required("Ubicación") })
      .positive({ message: validationMessages.required("Ubicación") })
      .optional(),
    startDate: z
      .preprocess((val) => validateDate(val), z.date({ message: validationMessages.invalidaFormat("Fecha de inicio") }))
      .optional()
      .nullable(),
    endDate: z
      .preprocess((val) => validateDate(val), z.date({ message: validationMessages.invalidaFormat("Fecha de fin") }))
      .optional()
      .nullable(),
    attendanceId: z
      .number({ message: validationMessages.required("Tipo de checado") })
      .positive({ message: validationMessages.required("Tipo de checado") })
      .optional(),
    attendanceDate: z
      .preprocess(
        (val) => validateDate(val),
        z.date({ message: validationMessages.invalidaFormat("Fecha de aplicación") }),
      )
      .optional()
      .nullable(),
    requestDate: z
      .preprocess(
        (val) => validateDate(val),
        z.date({ message: validationMessages.invalidaFormat("Fecha de registro") }),
      )
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: validationMessages.invalidDateRange("Fecha de fin", "Fecha de inicio"),
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      if (!data.startDate && !data.endDate) return true;
      return !!data.startDate && !!data.endDate;
    },
    {
      message: validationMessages.requiredIf("El campo Fecha de fin", "campo Fecha de inicio", "agregado y viceversa."),
      path: ["startDate", "endDate"],
    },
  );

export const EmployeeRequestsGetFilterSchema = z.object({
  page: z
    .number({ message: validationMessages.number("Página") })
    .min(1, { message: validationMessages.minNumber("Página", 1) })
    .nullable(),
  limit: z
    .number({ message: validationMessages.number("Límite") })
    .min(1, { message: validationMessages.minNumber("Límite", 1) })
    .nullable(),
  employee_id: z
    .number({ message: validationMessages.number("Empleado") })
    .optional()
    .nullable(),
  request_id: z
    .number({ message: validationMessages.number("ID de solicitud") })
    .min(1, { message: validationMessages.minNumber("ID de solicitud", 1) })
    .optional()
    .nullable(),
  request_status_id: z
    .number({ message: validationMessages.number("ID de estatus de solicitud") })
    .min(1, { message: validationMessages.minNumber("ID de estatus de solicitud", 1) })
    .optional()
    .nullable(),
  created_at: z
    .preprocess(
      (val) => {
        return validateDate(val);
      },
      z.date({ message: validationMessages.invalidaFormat("Fecha de creación (formato YYYY-MM-DD)") }),
    )
    .optional()
    .nullable(),
  request_date: z
    .preprocess(
      (val) => {
        return validateDate(val);
      },
      z.date({ message: validationMessages.invalidaFormat("Fecha de solicitud (formato YYYY-MM-DD)") }),
    )
    .optional()
    .nullable(),
  search: z
    .union([
      z
        .string()
        .min(1, { message: validationMessages.required("Búsqueda") })
        .max(255, { message: validationMessages.maxLength("Búsqueda", 255) }),
      z.number().transform((num) => num.toString()),
    ])
    .optional()
    .nullable(),
});

export const EmployeeRequestsUpdateSchema = z.object({
  requestId: z.number(),
  status: z.string(),
  approvedBy: z.number(),
});
