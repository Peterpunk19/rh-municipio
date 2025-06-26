import { z } from "zod";
import { validationMessages } from "@/common/validation/messages";

export const UserSchema = z.object({
  id: z.number().int().positive().optional(),
  uuid: z
    .string()
    .uuid({ message: validationMessages.invalidFormat("UUID") })
    .optional(),
  username: z
    .string({ message: validationMessages.required("Usuario") })
    .min(1, { message: validationMessages.required("Usuario") })
    .max(30, { message: validationMessages.maxLength("Usuario", 30) }),
  password: z
    .string({ message: validationMessages.required("Contraseña") })
    .min(8, { message: validationMessages.minLength("Contraseña", 8) })
    .max(30, { message: validationMessages.maxLength("Contraseña", 30) })
    .regex(/[A-Z]/, { message: validationMessages.oneUppercaseLetter("Contraseña") })
    .regex(/[a-z]/, { message: validationMessages.oneLowercaseLetter("Contraseña") })
    .regex(/[0-9]/, { message: validationMessages.oneNumber("Contraseña") })
    .regex(/[^A-Za-z0-9]/, { message: validationMessages.oneSymbol("Contraseña") }),
  set_password_key: z.string().min(1).optional().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  employee_id: z
    .number({ message: validationMessages.number("Empleado") })
    .optional()
    .nullable(),
  role_id: z.number({ message: validationMessages.required("Rol") }).nullable(),
  created_by_id: z.number().int().positive().optional().nullable(),
});

export const UserPostSchema = z
  .object({
    id: z.number().int().positive().optional(),
    uuid: z
      .string()
      .uuid({ message: validationMessages.invalidFormat("UUID") })
      .optional(),
    username: z
      .string({ message: validationMessages.required("Usuario") })
      .min(1, { message: validationMessages.required("Usuario") })
      .max(30, { message: validationMessages.maxLength("Usuario", 30) }),
    password: z
      .string({ message: validationMessages.required("Contraseña") })
      .min(8, { message: validationMessages.minLength("Contraseña", 8) })
      .max(30, { message: validationMessages.maxLength("Contraseña", 30) })
      .regex(/[A-Z]/, { message: validationMessages.oneUppercaseLetter("Contraseña") })
      .regex(/[a-z]/, { message: validationMessages.oneLowercaseLetter("Contraseña") })
      .regex(/[0-9]/, { message: validationMessages.oneNumber("Contraseña") })
      .regex(/[^A-Za-z0-9]/, { message: validationMessages.oneSymbol("Contraseña") }),
    set_password_key: z.string().min(1).optional().nullable(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    employee_id: z
      .number({ message: validationMessages.number("Empleado") })
      .optional()
      .nullable(),
    role_id: z.number({ message: validationMessages.required("Rol") }).nullable(),
    created_by_id: z.number().int().positive().optional().nullable(),
    secretaria_id: z.number().optional().nullable(),
    direcciones_ids: z.array(z.number()).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.role_id === 4 || data.role_id === 5) {
      if (!data.secretaria_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: validationMessages.required("Secretaria"),
          path: ["secretaria_id"],
        });
      }

      if (!data.direcciones_ids || data.direcciones_ids.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: validationMessages.oneItem("Dirección"),
          path: ["direcciones_ids"],
        });
      }
    }
  });

export const UserGetByFilterSchema = z.object({
  limit: z
    .number({ message: validationMessages.number("El limite") })
    .min(1, { message: validationMessages.minNumber("El limite", 1) })
    .nullable(),
  page: z
    .number({ message: validationMessages.number("El número de página") })
    .min(1, { message: validationMessages.minNumber("El número de página", 1) })
    .nullable(),
  role_id: z
    .number({ message: validationMessages.number("El ID del rol de usuario") })
    .min(1, { message: validationMessages.minNumber("El ID del rol de usuario", 1) })
    .nullable(),
  active: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof String) {
      const stringValue = val.toString().toLowerCase();
      if (stringValue === "true") return true;
      if (stringValue === "false") return false;
      return undefined;
    }
    return val;
  }, z.boolean({ message: validationMessages.invalidBoolean("Activo") }).nullable()),
  search: z
    .string({ message: validationMessages.required("Búsqueda") })
    .min(1, { message: validationMessages.required("Búsqueda") })
    .max(255, { message: validationMessages.maxLength("Búsqueda", 255) })
    .optional()
    .nullable(),
});

export const UserGetByIdSchema = z.object({
  id: z
    .number({ message: validationMessages.number("El ID") })
    .min(1, { message: validationMessages.minNumber("El ID", 1) })
    .max(999999999999999, { message: validationMessages.maxNumber("El ID", 999999999999999) })
    .nullable(),
});

export const UserDeactivateSchema = z.object({
  user_id: z
    .number({ message: validationMessages.number("El ID") })
    .min(1, { message: validationMessages.minNumber("El ID", 1) })
    .max(999999999999999, { message: validationMessages.maxNumber("El ID", 999999999999999) })
    .nullable(),
});

export const UserGetSchema = z.object({
  id: z.number().int().positive().optional(),
  uuid: z
    .string()
    .uuid({ message: validationMessages.invalidFormat("UUID") })
    .optional(),
  username: z
    .string({ message: validationMessages.required("Usuario") })
    .min(1, { message: validationMessages.required("Usuario") })
    .max(30, { message: validationMessages.maxLength("Usuario", 30) }),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  employee_id: z
    .number({ message: validationMessages.number("Empleado") })
    .optional()
    .nullable(),
  role_id: z.number({ message: validationMessages.required("Rol") }).nullable(),
  created_by_id: z.number().int().positive().optional().nullable(),
});
