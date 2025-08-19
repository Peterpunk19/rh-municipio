import { z } from "zod";
import { validationMessages } from "@/common/validation/messages";

export const SalariesGetFilterSchema = z.object({
  page: z
    .number({ message: validationMessages.number("Página") })
    .min(1, { message: validationMessages.minNumber("Página", 1) })
    .max(999999999999999, { message: validationMessages.maxNumber("Página", 999999999999999) })
    .nullable(),
  limit: z
    .number({ message: validationMessages.number("Límite") })
    .min(1, { message: validationMessages.minNumber("Límite", 1) })
    .max(999999999999999, { message: validationMessages.maxNumber("Límite", 999999999999999) })
    .nullable(),
  search: z
    .string({ message: validationMessages.required("Búsqueda") })
    .min(1, { message: validationMessages.required("Búsqueda") })
    .max(255, { message: validationMessages.maxLength("Búsqueda", 255) })
    .optional()
    .nullable(),
  categoryId: z
    .number({ message: validationMessages.number("Categoría") })
    .int()
    .positive()
    .optional()
    .nullable(),
  employeeTypeId: z
    .number({ message: validationMessages.number("Tipo de Empleado") })
    .int()
    .positive()
    .optional()
    .nullable(),
});

export const SalariesByCategoryAndEmployeeTypeFilterSchema = z.object({
  categoryId: z
    .number({ message: validationMessages.number("Categoría") })
    .min(1, { message: validationMessages.minNumber("Categoría", 1) }),
  employeeTypeId: z
    .number({ message: validationMessages.number("Tipo de Empleado") })
    .min(1, { message: validationMessages.minNumber("Tipo de Empleado", 1) }),
});
