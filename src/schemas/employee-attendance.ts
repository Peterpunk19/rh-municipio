import { z } from "zod";
import { validationMessages } from "@/common/validation/messages";
import { validateDate } from "@/schemas/utils";

export const EmployeeAttendancePostSchema = z
  .object({
    employeeId: z.number({ message: validationMessages.required("Empleado") }),
    checkIn: z.preprocess(
      (val) => validateDate(val),
      z.date({ message: validationMessages.invalidaFormat("Entrada") }),
    ),
    checkOut: z.preprocess(
      (val) => validateDate(val),
      z.date({ message: validationMessages.invalidaFormat("Salida") }),
    ),
    description: z
      .string({ message: validationMessages.required("Descripción") })
      .min(1, { message: validationMessages.required("Descripción") })
      .max(255, { message: validationMessages.maxLength("Descripción", 255) }),
  })
  .refine((data) => data.checkOut >= data.checkIn, {
    message: validationMessages.invalidDateRange("Salida", "Entrada"),
    path: ["checkOut"],
  });

export const EmployeeAttendanceItemSchema = z.object({
  numberEmployee: z
    .string({ message: "Número de empleado requerido" })
    .min(1, { message: "Número de empleado requerido" }),

  isEntry: z.number({ message: "El campo isEntry es requerido" }).refine((val) => val === 0 || val === 1, {
    message: "El campo isEntry debe ser 0 (salida) o 1 (entrada)",
  }),

  dateTime: z.string({ message: "Fecha requerida" }).refine((val) => !isNaN(Date.parse(val.replace(" ", "T"))), {
    message: "Formato de fecha inválido",
  }),
});

export const EmployeeAttendanceBulkInsertSchema = z.array(EmployeeAttendanceItemSchema);

export const EmployeeAttendanceGetFilterSchema = z.object({
  page: z
    .number({ message: validationMessages.number("Página") })
    .min(1, { message: validationMessages.minNumber("Página", 1) })
    .nullable(),
  limit: z
    .number({ message: validationMessages.number("Límite") })
    .min(1, { message: validationMessages.minNumber("Límite", 1) })
    .nullable(),
  employeeId: z
    .number({ message: validationMessages.number("Empleado") })
    .optional()
    .nullable(),
  checkIn: z
    .preprocess((val) => validateDate(val), z.date({ message: validationMessages.invalidaFormat("Fecha de entrada") }))
    .optional()
    .nullable(),
  checkOut: z
    .preprocess((val) => validateDate(val), z.date({ message: validationMessages.invalidaFormat("Fecha de salida") }))
    .optional()
    .nullable(),
  typeAttendance: z
    .number({ message: validationMessages.number("Asistencia") })
    .min(1, { message: validationMessages.minNumber("Asistencia", 1) })
    .optional()
    .nullable(),
  location: z
    .number({ message: validationMessages.number("Ubicación") })
    .min(1, { message: validationMessages.minNumber("Ubicación", 1) })
    .optional()
    .nullable(),
  organismPublic: z
    .number({ message: validationMessages.number("Organismo Público") })
    .min(1, { message: validationMessages.minNumber("Organismo Público", 1) })
    .optional()
    .nullable(),
  organismAdministrative: z
    .number({ message: validationMessages.number("Organismo Administrativo") })
    .min(1, { message: validationMessages.minNumber("Organismo Administrativo", 1) })
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

export const EmployeeAttendanceGetByIdSchema = z.object({
  id: z
    .number({ message: validationMessages.number("ID") })
    .min(1, { message: validationMessages.minNumber("ID", 1) })
    .max(999999999999999, { message: validationMessages.maxNumber("ID", 999999999999999) })
    .nullable(),
});
