import { z } from "zod";
import { validationMessages } from "@/common/validation/messages";
import { validateDate } from "@/schemas/utils";

export const CreateUpdateLeaderSchema = z
  .object({
    direccionId: z
      .number({ message: validationMessages.number("El ID del organismo administrativo") })
      .min(1, { message: validationMessages.minNumber("El ID del organismo administrativo", 1) })
      .max(999999999999999, {
        message: validationMessages.maxNumber("El ID del organismo administrativo", 999999999999999),
      }),
    director: z
      .number({ message: validationMessages.number("El ID del director") })
      .min(1, { message: validationMessages.minNumber("El ID del director", 1) })
      .max(999999999999999, { message: validationMessages.maxNumber("El ID del director", 999999999999999) }),
    deputyDirector: z
      .number({ message: validationMessages.number("El ID del subdirector") })
      .min(1, { message: validationMessages.minNumber("El ID del subdirector", 1) })
      .max(999999999999999, { message: validationMessages.maxNumber("El ID del subdirector", 999999999999999) })
      .optional()
      .nullable(),
    startDate: z.preprocess(
      (val) => validateDate(val),
      z.date({ message: validationMessages.invalidaFormat("Fecha de inicio") }),
    ),
    endDate: z.preprocess(
      (val) => validateDate(val),
      z.date({ message: validationMessages.invalidaFormat("Fecha de fin") }),
    ),
  })
  .refine((data) => data.director !== data.deputyDirector, {
    message: "El director y el subdirector no pueden ser la misma persona",
    path: ["deputyDirector"],
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: validationMessages.invalidDateRange("Fecha de fin", "Fecha de inicio"),
    path: ["endDate"],
  });
