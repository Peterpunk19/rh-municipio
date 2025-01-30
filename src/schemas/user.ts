import { z } from "zod";
import { RoleSchema } from "./role-module-actions";

export const UserSchema = z.object({
  id: z.number().int().positive().optional(),
  uuid: z.string().optional(),
  username: z.string({ required_error: "El nombre del usuario es requerido y debe ser de al menos 1 caracter" }).min(1),
  password: z.string().min(1),
  set_password_key: z.string().min(1).optional().nullable(),
  create_at: z.date().optional(),
  updated_at: z.date().optional(),
  employee_id: z.number().int().optional(),
  role_id: z.number().int().positive(),
  created_by_id: z.number().int().positive().optional(),
  employee: z.object({ id: z.number().int().positive() }).optional(),
  role: RoleSchema,
  user_module_actions: z.array(z.object({ id: z.number().int().positive() })),
  attendances_created_by: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_incidents: z.array(z.object({ id: z.number().int().positive() })).optional(),
  created_by: z.object({ id: z.number().int().positive() }).optional(),
  users_created: z.array(z.object({ id: z.number().int().positive() })).optional(),
});
