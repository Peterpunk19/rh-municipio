import { z } from "zod";
import {
  EmployeeTypeSchema,
  DepartamentoSchema,
  PayrollSchema,
  IncidentsSchema,
  IncidentStatusSchema,
} from "./catalogs";
import { EmployeeSchema } from "./employee";
import { EmployeeAttendanceSchema } from "./employee-attendance";
import { UserSchema } from "./user";

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