import { z } from "zod";
import { EmployeeTypeSchema, DepartamentoSchema, PayrollSchema, CategorySchema } from "./catalogs";
import { EmployeeSchema } from "./employee";

export const EmployeeHiringSchema = z.object({
  id: z.number().int().positive(),
  employee_id: z.number().int().positive(),
  start_job_date: z.date().optional(),
  end_job_date: z.date().optional(),
  category_id: z.number().int().positive(),
  employee_type_id: z.number().int().positive(),
  departamento_id: z.number().int().positive(),
  payroll_id: z.number().int().positive(),
  active: z.boolean().optional(),
  created_by: z.number().int().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  category: CategorySchema,
  employee_type: EmployeeTypeSchema,
  departamento: DepartamentoSchema,
  payroll: PayrollSchema,
  employee: EmployeeSchema.optional(),
  created_by_user: EmployeeSchema.optional(),
  employee_attendance: z.array(z.object({ id: z.number().int().positive() })),
});