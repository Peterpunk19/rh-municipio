import { z } from "zod";
import { validationMessages } from "@/common/validation/messages";
import { validateDate } from "@/schemas/utils";

const ScheduleItemSchema = z
  .object({
    date: z
      .string()
      .min(1, { message: validationMessages.returnMessage("La fecha es requerida.") })
      .refine((v) => !isNaN(Date.parse(v)), {
        message: validationMessages.returnMessage("Formato de fecha inválido."),
      }),

    startHourId: z
      .string()
      .or(z.number())
      .transform((v) => Number(v))
      .refine((v) => v > 0, {
        message: validationMessages.returnMessage("Hora de inicio inválida."),
      }),

    endHourId: z
      .string()
      .or(z.number())
      .transform((v) => Number(v))
      .refine((v) => v > 0, {
        message: validationMessages.returnMessage("Hora de salida inválida."),
      }),
  })
  .refine((data) => data.startHourId !== data.endHourId, {
    message: validationMessages.returnMessage("La hora de entrada y salida no pueden ser iguales."),
    path: ["endHourId"],
  });

export const JobScheduleCalendarPostSchema = z
  .object({
    employees: z
      .array(z.number(), { message: validationMessages.returnMessage("Debe seleccionar al menos un empleado.") })
      .min(1, { message: validationMessages.returnMessage("Debe seleccionar al menos un empleado.") }),
    schedules: z
      .array(ScheduleItemSchema, { message: validationMessages.returnMessage("Debe enviar al menos un horario.") })
      .min(0),
    from: z
      .string()
      .refine((v) => !v || !isNaN(Date.parse(v)), {
        message: validationMessages.returnMessage("Fecha de inicio inválida."),
      })
      .optional()
      .nullable(),
    to: z
      .string()
      .refine((v) => !v || !isNaN(Date.parse(v)), {
        message: validationMessages.returnMessage("Fecha de fin inválida"),
      })
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.schedules.length === 0) {
        return !!data.from && !!data.to;
      }
      return true;
    },
    {
      message: validationMessages.returnMessage("Debe enviar fecha de inicio y fin cuando no hay horario."),
      path: ["from"],
    },
  )
  .refine(
    (data) => {
      if (data.from && data.to) {
        return new Date(data.from) <= new Date(data.to);
      }
      return true;
    },
    {
      message: validationMessages.returnMessage("El rango de fechas es inválido."),
      path: ["from"],
    },
  );

export const JobScheduleCalendarGetSchema = z.object({
  page: z
    .number({ message: validationMessages.number("Página") })
    .min(1, { message: validationMessages.minNumber("Página", 1) })
    .nullable(),
  limit: z
    .number({ message: validationMessages.number("Límite") })
    .min(1, { message: validationMessages.minNumber("Límite", 1) })
    .nullable(),
  from: z
    .preprocess((val) => validateDate(val), z.date({ message: validationMessages.invalidaFormat("Campo De") }))
    .optional()
    .nullable(),
  to: z
    .preprocess((val) => validateDate(val), z.date({ message: validationMessages.invalidaFormat("Campo A") }))
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
