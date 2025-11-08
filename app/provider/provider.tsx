"use client";

import { store } from "@/redux/store";
import { ProgressProvider } from "@bprogress/next/app";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { SocketProvider } from "./socket-provider";

export default function Provider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}): React.ReactNode {
  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        <ProgressProvider
          height="4px"
          color={"#fffd00"}
          options={{ showSpinner: true }}
          shallowRouting
        >
          <SocketProvider>{children}</SocketProvider>
        </ProgressProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
