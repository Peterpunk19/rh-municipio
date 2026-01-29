import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  employee_id: string;
  role: string;
  role_name: string;
  role_display_name: string;
  number_employee: string;
  picture: string;
  must_change_password: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    accessToken?: string;
    menuItems?: any[];
  }
}

import { JWT } from "@auth/core/jwt";

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    employee_id?: string;
    role?: string;
    role_name?: string;
    role_display_name?: string;
    number_employee?: string;
    accessToken?: string;
    menuItems?: any[];
    must_change_password?: boolean;
  }
}
