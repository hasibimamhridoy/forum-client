"use client";

import type React from "react";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { disconnectSocket, getSocket } from "../lib/socket";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.token?.accessToken) {
      const username = session.token?.userName || session.token?.email;
      const socket = getSocket(session.token?.accessToken, username);

      return () => {
        // Keep socket connected, only disconnect on logout
      };
    }

    if (status === "unauthenticated") {
      disconnectSocket();
    }
  }, [session, status]);

  return <>{children}</>;
}
