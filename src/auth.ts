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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.employee_id = (user as any).employee_id;
        token.name = user.name ?? "";
        token.role = (user as any).role ?? "";
        token.role_name = (user as any).role_name ?? "";
        token.role_display_name = (user as any).role_display_name ?? "";
        token.number_employee = (user as any).number_employee ?? "";
        token.accessToken = (user as any).accessToken;
        token.menuItems = (user as any).menuItems ?? [];
        token.must_change_password = (user as any).must_change_password ?? false;
        token.jwt = "JWT";
      }

      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        id: token.id as string,
        employee_id: token.employee_id as string,
        name: token.name as string,
        role: token.role as string,
        role_name: token.role_name as string,
        role_display_name: token.role_display_name as string,
        number_employee: token.number_employee as string,
        must_change_password: token.must_change_password as boolean,
        session: "SESSION",
      };

      session.accessToken = token.accessToken as string;
      session.menuItems = token.menuItems as any[];

      return session;
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
