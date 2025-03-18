"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export const SessionTimer = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const expirationTime = new Date(session.expires).getTime();
      const currentTime = Date.now();
      const remainingTime = expirationTime - currentTime;

      const timeoutId = setTimeout(() => {
        signOut({ callbackUrl: "/login" });
      }, remainingTime);

      return () => clearTimeout(timeoutId);
    }
  }, [session]);

  return null;
};
