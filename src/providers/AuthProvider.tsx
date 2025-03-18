"use client";

import { SessionProvider } from "next-auth/react";
import { Providers } from "@/store/providers";
import MyApp from "@/app/app";
import NextTopLoader from "nextjs-toploader";
import "@/app/global.css";

export default function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <>
      <NextTopLoader color="#5D87FF" />
      <SessionProvider session={session}>
        <Providers>
          <MyApp>{children}</MyApp>
        </Providers>
      </SessionProvider>
    </>
  );
}
