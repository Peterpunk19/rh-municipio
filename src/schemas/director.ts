import { z } from "zod";
import { DireccionSchema } from "./catalogs";
import { EmployeeSchema } from "./employee";

export const DirectorSchema = z.object({
  id: z.number().int().positive(),
  direccion_id: z.number().int().positive(),
  employee_id: z.number().int().positive().optional(),
  substitute_id: z.number().int().positive().optional(),
  profesion: z.string().min(1),
  direccion: DireccionSchema,
  employee: EmployeeSchema.optional(),
  substitute: EmployeeSchema.optional(),
  active: z.boolean().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
