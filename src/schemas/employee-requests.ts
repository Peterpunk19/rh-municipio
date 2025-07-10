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
  direccion_id: z
    .union([z.number(), z.array(z.number())])
    .optional()
    .nullable(),
});

export const EmployeeRequestsUpdateSchema = z.object({
  requestId: z.number(),
  statusId: z.number({ message: validationMessages.required("Estatus de solicitud") }).positive({
    message: validationMessages.required("Estatus de solicitud"),
  }),
});

const EmployeeRequestPostBaseSchema = {
  folio: z
    .string({ message: validationMessages.required("Folio") })
    .min(1, { message: validationMessages.required("Folio") })
    .max(10, { message: validationMessages.maxLength("Folio", 10) })
    .optional()
    .nullable(),
  oficio: z.string().optional().nullable(),
  employeeId: z
    .number({ message: validationMessages.required("Empleado") })
    .positive({ message: validationMessages.required("Empleado") }),
  description: z
    .string({ message: validationMessages.required("Descripción") })
    .min(10, { message: validationMessages.minLength("Descripción", 10) })
    .max(200, { message: validationMessages.maxLength("Descripción", 200) }),
};

const ScheduleChangeSchema = z.object({
  requestId: z.literal(1),
  schedule: z
    .array(EmployeeScheduleRequestSchema, {
      required_error: validationMessages.required("Horario"),
      invalid_type_error: validationMessages.required("Horario"),
    })
    .min(1, { message: validationMessages.oneItem("Horario") }),
  startDate: z.preprocess(
    (val) => validateDate(val),
    z.date({ message: validationMessages.invalidaFormat("Fecha de inicio") }),
  ),
  endDate: z.preprocess(
    (val) => validateDate(val),
    z.date({ message: validationMessages.invalidaFormat("Fecha de fin") }),
  ),
  ...EmployeeRequestPostBaseSchema,
});

const ComisionChangeSchema = z.object({
  requestId: z.literal(2),
  locationId: z
    .number({ message: validationMessages.required("Ubicación") })
    .positive({ message: validationMessages.required("Ubicación") }),
  startDate: z.preprocess(
    (val) => validateDate(val),
    z.date({ message: validationMessages.invalidaFormat("Fecha de inicio") }),
  ),
  endDate: z.preprocess(
    (val) => validateDate(val),
    z.date({ message: validationMessages.invalidaFormat("Fecha de fin") }),
  ),
  ...EmployeeRequestPostBaseSchema,
});

const CheckerChangeSchema = z.object({
  requestId: z.literal(3),
  attendanceDate: z.preprocess(
    (val) => validateDate(val),
    z.date({ message: validationMessages.invalidaFormat("Fecha de aplicación") }),
  ),
  attendanceId: z
    .number({ message: validationMessages.required("Tipo de checado") })
    .positive({ message: validationMessages.required("Tipo de checado") }),
  ...EmployeeRequestPostBaseSchema,
});

const FingerprintRegistrationSchema = z.object({
  requestId: z.literal(4),
  locationId: z
    .number({ message: validationMessages.required("Ubicación") })
    .positive({ message: validationMessages.required("Ubicación") }),
  requestDate: z.preprocess(
    (val) => validateDate(val),
    z.date({ message: validationMessages.invalidaFormat("Fecha de registro") }),
  ),
  ...EmployeeRequestPostBaseSchema,
});

const AscriptionChangeSchema = z.object({
  requestId: z.literal(5),
  direccionId: z
    .number({ message: validationMessages.number("El organismo administrativo es requerido") })
    .min(1, { message: validationMessages.minNumber("ID de Organismo Administrativo", 1) }),
  locationId: z
    .number({ message: validationMessages.required("Ubicación") })
    .positive({ message: validationMessages.required("Ubicación") }),
  attendanceType: z
    .number({ message: validationMessages.required("Tipo de checado") })
    .positive({ message: validationMessages.required("Tipo de checado") }),
  ...EmployeeRequestPostBaseSchema,
});

const ReleaseRequestSchema = z.object({
  requestId: z.literal(6),
  departmentId: z.number(),
  comments: z.string().optional(),
  ...EmployeeRequestPostBaseSchema,
});

const UnionLeaveSchema = z.object({
  requestId: z.literal(7),
  startDate: z.string(),
  endDate: z.string(),
  unionName: z.string(),
  ...EmployeeRequestPostBaseSchema,
});

const RequestSchemas = [
  ScheduleChangeSchema,
  ComisionChangeSchema,
  CheckerChangeSchema,
  FingerprintRegistrationSchema,
  AscriptionChangeSchema,
  ReleaseRequestSchema,
  UnionLeaveSchema,
] as const;

export const EmployeeRequestPostSchema = z.discriminatedUnion("requestId", RequestSchemas).refine(
  (data) => {
    const hasDates = [1, 2, 5, 7].includes(data.requestId);

    if (!hasDates) return true;

    const d = data as {
      startDate: Date;
      endDate: Date;
    };

    if (!d.startDate || !d.endDate) return true;
    return d.endDate >= d.startDate;
  },
  {
    message: validationMessages.invalidDateRange("Fecha de fin", "Fecha de inicio"),
    path: ["endDate"],
  },
);
