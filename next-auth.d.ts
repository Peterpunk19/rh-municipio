declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
    role_name?: string;
    role_display_name?: string;
    number_employee?: string;
    accessToken?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    role?: string;
    role_name?: string;
    role_display_name?: string;
    number_employee?: string;
    accessToken?: string;
  }
}
