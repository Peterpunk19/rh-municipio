import NextAuth, { type DefaultSession } from "next-auth";
import type { Role } from "@prisma/client";

export type ExtendedUser = DefaultSession["user"] & {
    id: string;
    role: Role;
    picture: string;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}

import { JWT } from "@auth/core/jwt";

declare module "@auth/core/jwt" {
    interface JWT {
        role?: Role;
    }
}