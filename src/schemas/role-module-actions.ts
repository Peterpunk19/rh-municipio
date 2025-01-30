import { z } from "zod";

const RoleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  description: z.string().min(1),
  active: z.boolean().optional(),
  users: z.array(z.object({ id: z.number().int().positive() })).optional(),
  modules: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const ModuleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  role_id: z.number().int().positive(),
  roles: RoleSchema.array().optional(),
  actions: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const ActionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().min(1),
  active: z.boolean().optional(),
  modules: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const ModuleActionSchema = z.object({
  id: z.number().int().positive(),
  module_id: z.number().int().positive(),
  action_id: z.number().int().positive(),
  active: z.boolean().optional(),
  module: ModuleSchema,
  action: ActionSchema,
  user_module_actions: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const UserModuleActionsSchema = z.object({
  id: z.number().int().positive(),
  active: z.boolean().optional(),
  module_action_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  module_action: ModuleActionSchema,
});

export { RoleSchema, ModuleSchema, ActionSchema, ModuleActionSchema, UserModuleActionsSchema };
