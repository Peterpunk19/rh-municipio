import React from "react";
import { Providers } from "@/store/providers";
import MyApp from "./app";
import NextTopLoader from "nextjs-toploader";
import "./global.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata = {
  title: "Plataforma de incidencias y nominas",
  description:
    "Plataforma de incidencias y nominas - H Ayuntamiento de Tuxtla Gutíerrez",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body>
          <NextTopLoader color="#5D87FF" />
          <Providers>
            <MyApp>{children}</MyApp>
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
