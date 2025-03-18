import React from "react";
import { auth } from "@/auth";
import AuthProvider from "@/providers/AuthProvider";
import { SessionTimer } from "@/components/auth/SessionTimer";

export const metadata = {
  title: "Plataforma de incidencias y nominas",
  description: "Plataforma de incidencias y nominas - H Ayuntamiento de Tuxtla Gutíerrez",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <AuthProvider session={session}>
          <SessionTimer />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
