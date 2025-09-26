"use server";

import type * as z from "zod";
import { LoginSchema } from "@/schemas/authentication";
import { signIn, auth } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT, DEFAULT_ADMIN_REDIRECT, DEFAULT_EMPLOYEE_REDIRECT } from "@/routes";
import { ROLES_ID_VALUES } from "@/common/constants/Roles";
import { AuthError } from "next-auth";

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

    const session = await auth();
    const roleId = session?.user?.role?.toString() || "";

    let redirectTo = DEFAULT_LOGIN_REDIRECT;

    if (roleId) {
      switch (roleId) {
        case ROLES_ID_VALUES.empleado.toString():
          redirectTo = DEFAULT_EMPLOYEE_REDIRECT;
          break;

        case ROLES_ID_VALUES.admin.toString():
        case ROLES_ID_VALUES.capturista.toString():
        case ROLES_ID_VALUES.analista.toString():
        case ROLES_ID_VALUES.admin_incidencias.toString():
        case ROLES_ID_VALUES.admin_nomina.toString():
        case ROLES_ID_VALUES.director.toString():
          redirectTo = DEFAULT_ADMIN_REDIRECT;
          break;

        default:
          redirectTo = DEFAULT_LOGIN_REDIRECT;
      }
    }

    return { success: "Login exitoso!", redirectTo };
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
