"use client";
import { Toaster } from "@/components/ui/sonner";
import type React from "react";
import { ForumNavigation } from "./_components/forum-navigation";

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* <ProtectedForum> */}
      <ForumNavigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
        <Toaster />
        {/* <NotificationToast></NotificationToast> */}
      </main>
      {/* </ProtectedForum> */}
    </div>
  );
}
