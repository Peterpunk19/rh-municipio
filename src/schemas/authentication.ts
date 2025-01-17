import { z } from "zod";


export const LoginSchema = z.object({
  username: z.string().min(3,{ message: "Introduce un nombre de usuario válido" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Introduce un correo válido" }),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, { message: "El token es obligatorio" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
});


export const UserSchema = z.object({
  id: z.number().int().positive().optional(),
  password: z.string().min(1),
  name: z
    .string({
      required_error:
        "El nombre es requerido y debe ser de al menos 1 caracter",
    })
    .min(1),
  lastname: z.string().min(1),
  second_lastname: z.string().min(1),
  photo: z.string({ required_error: "La url de la foto es requerido" }),
  email: z.string().email(),
  sex: z.enum(["M", "F"]),
  phone_number: z.string().min(1),
  office_phone: z.string().optional(),
  office_address: z.string().optional(),
  service_hours: z.string().optional(),
  birthday: z.date().optional(),
  badge_number: z.string().optional(),
  user_type_id: z.number().int(),
  entry_date: z.date().optional(),
  vacation_days: z.number().int().positive().optional(),
  visible_in_directory: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  role: z.enum(["USER", "ADMIN", "SUPER"]).optional(),
  tax_address: z.string().optional(),
  ish: z.string().optional(),
  payments: z.array(z.any()).optional(),
  fileAttachments: z.array(z.any()).optional(),
  specialties: z.array(z.any()).optional(),
  hobbies: z.array(z.any()).optional(),
  modules: z.array(z.any()).optional(),
  changesSessions: z.array(z.any()).optional(),
  user_type: z.array(z.any()).optional(),
  is_verfied: z.boolean().optional(),
  is_active: z.boolean().optional(),
});