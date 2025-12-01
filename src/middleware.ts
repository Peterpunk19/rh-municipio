import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  apiPrefix,
  DEFAULT_ADMIN_REDIRECT,
  DEFAULT_EMPLOYEE_REDIRECT,
  CHANGE_PASSWORD_ROUTE,
} from "@/routes";

const ROLE_EMPLOYEE = "empleado";

const excludedApiRoutes = ["/api/employee-attendance/bulk-import", "/api/employees/import"];

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isLoggedIn = !!session;
  const role = session?.user?.role_name;

  /* =========================
     PUBLIC
  ========================= */

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  /* =========================
     API PROTEGIDAS
  ========================= */

  if (pathname.startsWith(apiPrefix)) {
    if (excludedApiRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    if (!isLoggedIn) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  /* =========================
     LOGIN
  ========================= */

  if (authRoutes.includes(pathname)) {
    if (isLoggedIn) {
      if (
        pathname === "/login" &&
        req.nextUrl.searchParams.get("message") === "password_changed" &&
        !req.nextUrl.searchParams.get("session_invalidated")
      ) {
        const response = NextResponse.redirect(
          new URL("/login?message=password_changed&session_invalidated=true", req.url),
        );
        response.cookies.delete("next-auth.session-token");
        response.cookies.delete("__Secure-next-auth.session-token");
        return response;
      }

      if (pathname === "/login" && req.nextUrl.searchParams.get("session_invalidated") === "true") {
        return NextResponse.next();
      }

      // Si debe cambiar contraseña, permitir acceso a la página de cambio
      if (pathname === CHANGE_PASSWORD_ROUTE && session?.user?.must_change_password) {
        return NextResponse.next();
      }
      // Si ya está logueado y no debe cambiar contraseña, redirigir al dashboard
      if (pathname === CHANGE_PASSWORD_ROUTE && !session?.user?.must_change_password) {
        const redirectTo = role === ROLE_EMPLOYEE ? DEFAULT_EMPLOYEE_REDIRECT : DEFAULT_ADMIN_REDIRECT;
        return NextResponse.redirect(new URL(redirectTo, req.url));
      }

      const redirectTo = role === ROLE_EMPLOYEE ? DEFAULT_EMPLOYEE_REDIRECT : DEFAULT_ADMIN_REDIRECT;
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    return NextResponse.next();
  }

  /* =========================
     RUTAS PRIVADAS
  ========================= */

  // --- FORZAR CAMBIO DE CONTRASEÑA ---
  if (isLoggedIn && session?.user?.must_change_password) {
    // Si debe cambiar contraseña y no está en la página de cambio, redirigir
    if (pathname !== CHANGE_PASSWORD_ROUTE && !pathname.startsWith(apiPrefix)) {
      return NextResponse.redirect(new URL(CHANGE_PASSWORD_ROUTE, req.url));
    }
  }

  // --- RUTAS PRIVADAS ---
  const isAdminRoute = pathname.startsWith("/admin");
  const isEmployeeRoute = pathname.startsWith("/employee");

  if (!isLoggedIn && (isAdminRoute || isEmployeeRoute)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  /* =========================
     RESTRICCIÓN POR ROL
  ========================= */

  if (isLoggedIn) {
    if (isAdminRoute && role === ROLE_EMPLOYEE) {
      return NextResponse.redirect(new URL(DEFAULT_EMPLOYEE_REDIRECT, req.url));
    }

    if (isEmployeeRoute && role !== ROLE_EMPLOYEE) {
      return NextResponse.redirect(new URL(DEFAULT_ADMIN_REDIRECT, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
