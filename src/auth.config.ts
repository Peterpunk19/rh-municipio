import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas/authentication";
import { login } from "@/services/authentication";

export default {
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_URL?.includes("localhost"),
      },
    },
  },
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

  // 🔑 Necesario para NextAuth v5
  secret: process.env.NEXTAUTH_SECRET,

  // ✅ confía en el host automáticamente (útil en Docker/local)
  trustHost: true,

  // o si prefieres lista explícita de hosts válidos
  trustedHosts: [
    "localhost:3000",
    "127.0.0.1:3000",
    "host.docker.internal:3000",
    "https://rhadmin-1005155783559.us-central1.run.app",
  ],
} satisfies NextAuthConfig;
