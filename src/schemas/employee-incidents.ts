import { z } from "zod";
import { IncidentsSchema, IncidentStatusSchema } from "./catalogs";
import { EmployeeSchema } from "./employee";
import { EmployeeAttendanceSchema } from "./employee-attendance";
import { UserSchema } from "./user";
import { validationMessages } from "@/common/validation/messages";

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
      (val) => {
        if (typeof val === "string" || val instanceof String) {
          const parsedDate = new Date(val as string);
          return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
        }
        return val;
      },
      z.date({ message: validationMessages.invalidaFormat("Fecha de Inicio") }),
    ),
    endDate: z.preprocess(
      (val) => {
        if (typeof val === "string" || val instanceof String) {
          const parsedDate = new Date(val as string);
          return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
        }
        return val;
      },
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
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: validationMessages.invalidDateRange("Fecha de Terminación", "Fecha de Inicio"),
    path: ["endDate"],
  });

export const EmployeeIncidentsSchema = z.object({
  id: z.number().int().positive(),
  folio: z.number().int().positive(),
  oficio: z.string().min(1),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  description: z.string().min(1),
  incident_status_id: z.number().int().positive(),
  incident_id: z.number().int().positive(),
  employee_id: z.number().int().positive(),
  employee_attendance_id: z.number().int().positive(),
  created_by_id: z.number().int().positive(),
  validated_by: z.number().int().optional(),
  user_id: z.number().int().optional(),
  incident_status: IncidentStatusSchema,
  incident: IncidentsSchema,
  employee: EmployeeSchema,
  employee_attendance: EmployeeAttendanceSchema,
  created_by: EmployeeSchema,
  user: UserSchema.optional(),
  employee_vacations: z.array(z.object({ id: z.number().int().positive() })).optional(),
  created_at: z.date().optional(),
  recived_at: z.date().optional(),
  validated_at: z.date().optional(),
});
