import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";

import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
    signOut: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === "update") {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_AUTH}/user-info/${token.id}`);

          if (response.ok) {
            const userData = await response.json();
            if (userData?.responseObject) {
              return {
                ...token,
                name: `${userData.responseObject.name} ${userData.responseObject.paternal_last_name}`,
                role: userData.responseObject.role_id.toString(),
                role_name: userData.responseObject.role_display_name.toString(),
                number_employee: userData.responseObject.number_employee.toString(),
                accessToken: token.accessToken,
              };
            }
          }
        } catch (error) {
          console.error("Error actualizando JWT:", error);
        }
      }

      if (user) {
        token.id = user.id;
        token.name = user.name || "";
        token.role = user.role || "";
        token.role_name = user.role_name || "";
        token.number_employee = user.number_employee || "";
        token.accessToken = user.accessToken;
      }

      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.role_name = token.role_name as string;
        session.user.number_employee = token.number_employee as string;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async signIn({ user }) {
      if (!user?.id) return false;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_AUTH}/user-info/${user.id}`);

        if (!response.ok) throw new Error("User not found");

        const existingUser = await response.json();
        if (existingUser?.responseObject) {
          user.name = `${existingUser.responseObject.name} ${existingUser.responseObject.paternal_last_name}`;
          user.role = existingUser.responseObject.role_id.toString();
          user.role_name = existingUser.responseObject.role_display_name.toString();
          user.number_employee =
            existingUser.responseObject.number_employee !== undefined
              ? existingUser.responseObject.number_employee.toString()
              : "";
          return true;
        }
        return false;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
    updateAge: 60 * 1,
  },
  ...authConfig,
});
