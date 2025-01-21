import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

import { getUserById } from "./services/user";
export const { handlers:{GET, POST}, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user }) {
      const existingUser = await getUserById(Number(user.id));
      console.log(`existing User: ${JSON.stringify(existingUser)}`);

      if (!existingUser) {
        return false;
      }
      return true;
    },
    async jwt({token}){
      if(!token.sub) return token;
      const existingUser = await getUserById(Number(token.sub));
      if(!existingUser) return token;
      token.role = existingUser.role;
      token.picture = existingUser.photo;
      return token;
    },
    async session({token, session}){
      if(token.sub && session.user){
        session.user.id = token.sub;
      }
      /*if(token.role && session.user){
        session.user.role = token.role;
      }
      if(token.picture && session.user){
        session.user.picture = token.picture;
      }*/

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
 ...authConfig})


