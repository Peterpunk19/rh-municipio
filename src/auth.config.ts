import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas/authentication";
import { login } from "@/services/authentication";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      // @ts-ignore
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const response = await login(validatedFields.data);
          const user = response.payload;
          if (!user || !user.id) return null;
          return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
