"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import useAuth from "../hooks/useAuth";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5003";

let socket: Socket | null = null;

export function getSocket(token?: string, username?: string): Socket {
  if (!socket) {
    const auth: any = {};

    if (token) {
      auth.token = token;
      auth.username = username || "Anonymous";
    }

    socket = io(WS_URL, {
      auth,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
      autoConnect: !!token,
    });

    socket.on("connect", () => {
      console.log("[v0] Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("[v0] Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("[v0] Socket connection error:", error);

      if (error.message === "Authentication error" && !token) {
        socket?.disconnect();
      }
    });

    if (typeof window !== "undefined") {
      (window as any).__socket = socket;
    }
  } else if (token && !socket.connected) {
    socket.auth = { token, username: username || "Anonymous" };
    socket.connect();
  }

  return socket!;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    if (typeof window !== "undefined") {
      (window as any).__socket = null;
    }
  }
}

export function useSocket() {
  const { accessToken, userName } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (accessToken && !socketRef.current) {
      console.log("[v0] Initializing socket with token");
      socketRef.current = getSocket(accessToken, userName || undefined);
    } else if (!accessToken && socketRef.current) {
      console.log("[v0] Disconnecting socket - no token");
      disconnectSocket();
      socketRef.current = null;
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
    };
  }, [accessToken, userName]);

  return socketRef.current;
}

export function useSocketEvent(event: string, handler: (data: any) => void) {
  const socket = useSocket();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket) {
      console.log("[v0] Socket not available for event:", event);
      return;
    }

    const eventHandler = (data: any) => {
      console.log("[v0] Socket event received:", event, data);
      handlerRef.current(data);
    };

    console.log("[v0] Registering socket event listener:", event);
    socket.on(event, eventHandler);

    return () => {
      console.log("[v0] Unregistering socket event listener:", event);
      socket.off(event, eventHandler);
    };
  }, [socket, event]); // Removed handler from dependencies
}

export function useThreadRoom(threadId: string) {
  const socket = useSocket();
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!socket || !threadId) {
      console.log("[v0] Cannot join thread - socket or threadId missing");
      return;
    }

    const joinThread = () => {
      if (!hasJoinedRef.current) {
        console.log("[v0] Joining thread:", threadId);
        socket.emit("join:thread", threadId);
        hasJoinedRef.current = true;
      }
    };

    if (socket.connected) {
      joinThread();
    } else {
      console.log("[v0] Waiting for socket connection to join thread");
      socket.once("connect", joinThread);
    }

    return () => {
      if (hasJoinedRef.current) {
        console.log("[v0] Leaving thread:", threadId);
        socket.emit("leave:thread", threadId);
        hasJoinedRef.current = false;
      }
    };
  }, [socket, threadId]);
}
