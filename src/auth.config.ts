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
            if (!response?.payload) return null;

            return {
              id: response.payload.id.toString(),
              name: response.payload.name,
              email: response.payload.email,
              role: response.payload.role_id.toString(),
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
