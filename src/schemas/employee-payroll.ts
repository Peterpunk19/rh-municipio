import { z } from "zod";
import { validationMessages } from "@/common/validation/messages";
import { validateDate } from "@/schemas/utils";

export const EmployeePayrollGetFilterSchema = z.object({
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
  direccionId: z
    .number({ message: validationMessages.number("Empleado") })
    .optional()
    .nullable(),
  from: z.string({ message: validationMessages.required("Inicio") }),
  to: z.string({ message: validationMessages.required("Fin") }),
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
