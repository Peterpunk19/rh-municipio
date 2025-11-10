"use server";

import type * as z from "zod";
import { LoginSchema } from "@/schemas/authentication";
import { signIn } from "@/auth";
import { login as loginService } from "@/services/authentication";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Campos invalidos!" };
  }

  const { username, password } = validateFields.data;

  const authResponse = await loginService(validateFields.data);

  if (!authResponse?.success) {
    return { error: authResponse?.message || "Credenciales incorrectas!" };
  }

  try {
    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    return { success: "Login exitoso!" };
  } catch (error: any) {
    return { error: "Error al iniciar sesión" };
  }
};
