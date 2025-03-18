import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { getToken } from "next-auth/jwt";
import { HttpStatusCode } from "axios";
import { HttpMessages } from "@/common/response/messages";

import { publicRoutes, authRoutes, apiAuthPrefix, apiPrefix, DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { NextResponse } from "next/server";
import { HttpResponse } from "./common/response/model";

const { auth } = NextAuth(authConfig);
// @ts-ignore
export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isRoot = nextUrl.pathname === "/";
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiRoute = nextUrl.pathname.startsWith(apiPrefix);

  if (isPublicRoute) {
    return null;
  }

  if (isRoot) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isApiAuthRoute) {
    return null;
  }

  if (isApiRoute) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (!token) {
        const response = HttpResponse.unauthorized(HttpMessages.error.notAuthorized, HttpStatusCode.Unauthorized);
        return NextResponse.json(response, { status: HttpStatusCode.Unauthorized });
      }
      return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
