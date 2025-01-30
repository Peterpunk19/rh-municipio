import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(3, { message: "Introduce un nombre de usuario válido" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Introduce un correo válido" }),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, { message: "El token es obligatorio" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
});
