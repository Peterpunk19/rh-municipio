import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
    role_name?: string;
    number_employee?: string;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string;
      role?: string;
      role_name?: string;
      number_employee?: string;
      accessToken?: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    role?: string;
    role_name?: string;
    number_employee?: string;
    accessToken?: string;
  }
}
