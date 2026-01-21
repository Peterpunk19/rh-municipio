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
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }

        const response = await login(validatedFields.data);

        if (!response?.success || !response?.responseObject?.payload) {
          return null;
        }

        return {
          id: response.responseObject.payload.id.toString(),
          employee_id: response.responseObject.payload.employee_id?.toString(),
          number_employee: response.responseObject.payload.number_employee,
          name: response.responseObject.payload.name,
          email: response.responseObject.payload.email,
          role: response.responseObject.payload.role_id.toString(),
          role_name: response.responseObject.payload.role_name.toString(),
          role_display_name: response.responseObject.payload.role_display_name.toString(),
          accessToken: response.responseObject.token,
          menuItems: response.responseObject.payload.menuItems,
          errorMessage: response?.message,
        };
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
