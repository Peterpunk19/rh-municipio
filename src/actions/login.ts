"use server";

import type * as z from "zod";
import { LoginSchema } from "@/schemas/authentication";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Campos invalidos!" };
  }
  const { username, password } = validateFields.data;
  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales incorrectas!" };
        default:
          return { error: `Error al iniciar sesión! ${error.message} ` };
      }
    }
    throw error;
  }

  return { success: "Login exitoso!" };
};
