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

export const EmployeeAttendanceGetFilterSchema = z.object({
  page: z
    .number({ message: validationMessages.number("Página") })
    .min(1, { message: validationMessages.minNumber("Página", 1) })
    .nullable(),
  limit: z
    .number({ message: validationMessages.number("Límite") })
    .min(1, { message: validationMessages.minNumber("Límite", 1) })
    .nullable(),
  checkIn: z
    .preprocess((val) => validateDate(val), z.date({ message: validationMessages.invalidaFormat("Fecha de entrada") }))
    .optional()
    .nullable(),
  checkOut: z
    .preprocess((val) => validateDate(val), z.date({ message: validationMessages.invalidaFormat("Fecha de salida") }))
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
