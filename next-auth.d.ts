declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
    role_name?: string;
    role_display_name?: string;
    number_employee?: string;
    accessToken?: string;
    employee_id?: string;
  }

  interface Session {
    menuItems?: any[];
    user: User;
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
    employee_id?: string;
    menuItems?: any[];
  }
}
