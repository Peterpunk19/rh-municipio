"use server";

import type * as z from "zod";
import { LoginSchema } from "@/schemas/authentication";
import { signIn } from "@/auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const parsed = LoginSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Campos inválidos" };
  }

  const { username, password } = parsed.data;

  try {
    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    return { success: "Login exitoso!" };
  } catch {
    return { error: "Usuario o contraseña incorrectos" };
  }
};
