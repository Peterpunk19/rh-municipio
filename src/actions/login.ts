"use server";

import type * as z from "zod";
import { LoginSchema } from "@/schemas/authentication";
import { signIn, auth } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT, DEFAULT_ADMIN_REDIRECT, DEFAULT_EMPLOYEE_REDIRECT } from "@/routes";
import { ROLES_ID_VALUES } from "@/common/constants/Roles";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Campos invalidos!" };
  }
  const { username, password } = validateFields.data;
  try {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Credenciales incorrectas!" };
    }

    return { success: "Login exitoso!" };
  } catch (error) {
    console.log(error);
    throw error;
  }

  return { success: "Login exitoso!" };
};
