import { z } from "zod";
import { validationMessages } from "@/common/validation/messages";
import { validateDate } from "@/schemas/utils";

export const IncidentRulesValidationSchema = z
  .object({
    employeeId: z.number({ message: validationMessages.required("Empleado") }),
    incidentId: z.number({ message: validationMessages.required("Tipo de Incidencia") }),
    startDate: z.preprocess(
      (val) => validateDate(val),
      z.date({ message: validationMessages.invalidaFormat("Fecha de Inicio") }),
    ),
    endDate: z.preprocess(
      (val) => validateDate(val),
      z.date({ message: validationMessages.invalidaFormat("Fecha de Terminación") }),
    ),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: validationMessages.invalidDateRange("Fecha de Terminación", "Fecha de Inicio"),
    path: ["endDate"],
  });
