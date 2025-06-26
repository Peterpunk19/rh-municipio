import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas/authentication";
import { login } from "@/services/authentication";

export default {
  providers: [
    Credentials({
      // @ts-ignore
      async authorize(credentials) {
        try {
          const validatedFields = LoginSchema.safeParse(credentials);
          if (validatedFields.success) {
            const response = await login(validatedFields.data);
            if (!response?.responseObject?.payload) return null;

            return {
              id: response.responseObject.payload.id.toString(),
              employee_id: response.responseObject.payload.employee_id?.toString(),
              name: response.responseObject.payload.name,
              email: response.responseObject.payload.email,
              role: response.responseObject.payload.role_id.toString(),
              accessToken: response.responseObject.token,
              menuItems: response.responseObject.payload.menuItems,
            };
          }
          return null;
        } catch (err) {
          console.error("Error in login:", err);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
