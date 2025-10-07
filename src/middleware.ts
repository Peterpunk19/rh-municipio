import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { HttpMessages } from "@/common/response/messages";
import { HttpResponse } from "@/common/response/model";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  apiPrefix,
  DEFAULT_ADMIN_REDIRECT,
  DEFAULT_EMPLOYEE_REDIRECT,
} from "@/routes";
import { auth } from "@/auth"; // 👈 Este wrapper hace la magia

const excludedApiRoutes = ["/api/employee-attendance/bulk-import", "/api/employees/import"];

export default auth(async (req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  const session = req.auth; // ✅ ESTA ES TU SESIÓN
  const isLoggedIn = !!session;
  const roleName = session?.user?.role_name;

  // --- PUBLIC ROUTES ---
  if (publicRoutes.includes(pathname)) return NextResponse.next();

  // --- ROOT ---
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // --- AUTH API ROUTES ---
  if (pathname.startsWith(apiAuthPrefix)) return NextResponse.next();

  // --- API PROTEGIDAS ---
  if (pathname.startsWith(apiPrefix)) {
    if (excludedApiRoutes.includes(pathname)) {
      return NextResponse.next();
    }
    if (!isLoggedIn) {
      const response = HttpResponse.unauthorized(HttpMessages.error.notAuthorized, HttpStatusCode.Unauthorized);
      return NextResponse.json(response, {
        status: HttpStatusCode.Unauthorized,
      });
    }
    return NextResponse.next();
  }

  // --- LOGIN ---
  if (authRoutes.includes(pathname)) {
    if (isLoggedIn) {
      const redirectTo = roleName === "empleado" ? DEFAULT_EMPLOYEE_REDIRECT : DEFAULT_ADMIN_REDIRECT;
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
    return NextResponse.next();
  }

  // --- RUTAS PRIVADAS ---
  const isAdminRoute = pathname.startsWith("/admin");
  const isEmployeeRoute = pathname.startsWith("/employee");

  if (!isLoggedIn && (isAdminRoute || isEmployeeRoute)) {
    // 🔒 Si no tiene sesión y entra a /admin o /employee → login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // --- RESTRICCIONES POR ROL ---
  if (isLoggedIn) {
    if (isAdminRoute && roleName === "empleado") {
      return NextResponse.redirect(new URL(DEFAULT_EMPLOYEE_REDIRECT, req.url));
    }
    if (isEmployeeRoute && roleName !== "empleado") {
      return NextResponse.redirect(new URL(DEFAULT_ADMIN_REDIRECT, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
