import React from "react";
import { Providers } from "@/store/providers";
import MyApp from "./app";
import NextTopLoader from 'nextjs-toploader';
import "./global.css";


export const metadata = {
  title: "Modernize Main Demo",
  description: "Modernize Main kit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTopLoader color="#5D87FF" />
        <Providers>
          <MyApp>{children}</MyApp>
        </Providers>
      </body>
    </html>
  );
}
