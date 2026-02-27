import { z } from "zod";
import { validationMessages } from "@/common/validation/messages";
import { validateDate } from "@/schemas/utils";
import { INCIDENT_TYPES_ID } from "@/common/constants/IncidentTypes";

export const EmployeeIncidentsPostSchema = z
  .object({
    folio: z
      .string({ message: validationMessages.required("Folio") })
      .min(1, { message: validationMessages.required("Folio") })
      .max(10, { message: validationMessages.maxLength("Folio", 10) })
      .optional()
      .nullable(),
    oficio: z
      .string({ message: validationMessages.required("Oficio") })
      .min(1, { message: validationMessages.required("Oficio") })
      .max(6, { message: validationMessages.maxLength("Oficio", 30) })
      .optional()
      .nullable(),
    employeeId: z.number({ message: validationMessages.required("Empleado") }),
    incidentId: z.number({ message: validationMessages.required("Tipo de Incidencia") }),
    incidentStatusId: z
      .number({ message: validationMessages.required("Estatus") })
      .optional()
      .nullable(),
    startDate: z.preprocess(
      (val) => validateDate(val),
      z.date({ message: validationMessages.invalidaFormat("Fecha de Inicio") }),
    ),
    endDate: z.preprocess(
      (val) => validateDate(val),
      z.date({ message: validationMessages.invalidaFormat("Fecha de Terminación") }),
    ),
    description: z
      .string({ message: validationMessages.required("Descripción") })
      .min(1, { message: validationMessages.required("Descripción") })
      .max(255, { message: validationMessages.maxLength("Descripción", 255) }),
    employeeAttendanceId: z
      .number({ message: validationMessages.required("Asistencia") })
      .optional()
      .nullable(),
    incidentDates: z
      .array(
        z.preprocess(
          (val) => validateDate(val),
          z.date({ message: validationMessages.invalidaFormat("Fechas de incidencia") }),
        ),
      )
      .optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: validationMessages.invalidDateRange("Fecha de Terminación", "Fecha de Inicio"),
    path: ["endDate"],
  })
  .refine(
    (data) => {
      if (data.incidentId === INCIDENT_TYPES_ID.LACTANCIA || data.incidentId === INCIDENT_TYPES_ID.ARRESTO) {
        return true;
      }
      return data.incidentDates && data.incidentDates.length > 0;
    },
    {
      message: validationMessages.required("Fechas de incidencia"),
      path: ["incidentDates"],
    },
  );

export const EmployeeIncidentsBulkCreateSchema = z
  .object({
    employeeIds: z
      .array(z.number({ message: validationMessages.required("Empleado") }))
      .min(1, { message: validationMessages.required("Empleado") })
      .default([]),
    incidentId: z.number({ message: validationMessages.required("Tipo de Incidencia") }),
    startDate: z.preprocess(
      (val) => validateDate(val),
      z.date({ message: validationMessages.invalidaFormat("Fecha de Inicio") }),
    ),
    endDate: z.preprocess(
      (val) => validateDate(val),
      z.date({ message: validationMessages.invalidaFormat("Fecha de Terminación") }),
    ),
    description: z
      .string({ message: validationMessages.required("Descripción") })
      .min(1, { message: validationMessages.required("Descripción") })
      .max(255, { message: validationMessages.maxLength("Descripción", 255) }),
    oficio: z
      .string({ message: validationMessages.required("Oficio") })
      .min(1, { message: validationMessages.required("Oficio") })
      .max(30, { message: validationMessages.maxLength("Oficio", 30) })
      .nullable()
      .optional(),
    incidentDates: z
      .array(
        z.preprocess(
          (val) => validateDate(val),
          z.date({ message: validationMessages.invalidaFormat("Fechas de incidencia") }),
        ),
      )
      .optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: validationMessages.invalidDateRange("Fecha de Terminación", "Fecha de Inicio"),
    path: ["endDate"],
  })
  .refine(
    (data) => {
      if (data.incidentId === INCIDENT_TYPES_ID.LACTANCIA || data.incidentId === INCIDENT_TYPES_ID.ARRESTO) {
        return true;
      }
      return data.incidentDates && data.incidentDates.length > 0;
    },
    {
      message: validationMessages.required("Fechas de incidencia"),
      path: ["incidentDates"],
    },
  );

export const EmployeeIncidentsGetFilterSchema = z.object({
  page: z
    .number({ message: validationMessages.number("Página") })
    .min(1, { message: validationMessages.minNumber("Página", 1) })
    .nullable(),
  limit: z
    .number({ message: validationMessages.number("Limite") })
    .min(1, { message: validationMessages.minNumber("Limite", 1) })
    .nullable(),
  employee_id: z
    .number({ message: validationMessages.number("Empleado") })
    .optional()
    .nullable(),
  incident_id: z
    .number({ message: validationMessages.number("Tipo de incidencia") })
    .optional()
    .nullable(),
  incident_status_id: z
    .number({ message: validationMessages.number("Estatus de incidencia") })
    .optional()
    .nullable(),
  start_date: z
    .preprocess((val) => validateDate(val), z.date({ message: validationMessages.invalidaFormat("Fecha de Inicio") }))
    .optional()
    .nullable(),
  end_date: z
    .preprocess(
      (val) => validateDate(val),
      z.date({ message: validationMessages.invalidaFormat("Fecha de terminacion") }),
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

export const EmployeeIncidentsUpdateSchema = z.object({
  id: z
    .number({ message: validationMessages.required("ID de Incidencia") })
    .min(1, { message: validationMessages.minNumber("ID de Incidencia", 1) })
    .max(999999999999999, { message: validationMessages.maxNumber("ID de Incidencia", 999999999999999) }),
  incidentStatusId: z.number({ message: validationMessages.required("Estatus") }),
});
