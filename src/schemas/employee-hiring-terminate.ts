import { z } from "zod";
import { validationMessages } from "@/common/validation/messages";
import { validateDate } from "@/schemas/utils";

export const EmployeeHiringTerminatePostSchema = z.object({
  employeeHiringId: z.number().int().positive(),
  terminationDate: z.preprocess(
    (val) => validateDate(val),
    z.date({ required_error: "La fecha del día festivo es requerida" }),
  ),
  reason: z.string({ message: validationMessages.required("Motivo") }),
  comments: z.string({ message: validationMessages.required("Comentarios") }),
});
