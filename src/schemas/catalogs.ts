import { z } from "zod";
import { DirectorSchema } from "./director";

const EmployeeTypeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const StatusEmployeeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const GenderSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const DepartamentoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
  direccion: z.object({ id: z.number().int().positive() }),
  direccion_id: z.number().int().positive(),
});

const PayrollSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const DireccionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  departamentos: z.array(z.object({ id: z.number().int().positive() })).optional(),
  secretaria: z.object({ id: z.number().int().positive() }),
  secretaria_id: z.number().int().positive(),
  directors: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const SecretariaSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  direcciones: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const CategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const IncidentsSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employee_incidents: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const IncidentStatusSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  type: z.number().int().positive(),
  active: z.boolean().optional(),
  employee_incidents: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const LocationSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_attendance: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_request_detail: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const RequestStatusSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employee_requests: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const AttendanceSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  employee_attendance: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_request_detail: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

export {
  EmployeeTypeSchema,
  GenderSchema,
  StatusEmployeeSchema,
  DepartamentoSchema,
  PayrollSchema,
  DireccionSchema,
  SecretariaSchema,
  CategorySchema,
  IncidentStatusSchema,
  IncidentsSchema,
  LocationSchema,
  RequestStatusSchema,
  AttendanceSchema,
};
