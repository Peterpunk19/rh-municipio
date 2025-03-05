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
