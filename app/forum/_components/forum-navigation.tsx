"use client";

import type React from "react";

import { NotificationToast } from "@/app/components/notfication-toast";
import { NotificationDropdown } from "@/app/components/notification-dropdown";
import useAuth from "@/app/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetNotificationsQuery } from "@/redux/notification/api";
import { LogOut, UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ForumNavigationProps {
  user: { email: string | null };
}

export function ForumNavigation() {
  const { userName } = useAuth();
  const router = useRouter();
  const { data, refetch, isLoading } = useGetNotificationsQuery(
    { page: 1, limit: 20, unreadOnly: false },
    {
      pollingInterval: 30000, // Poll every 30 seconds as fallback
    }
  );

  console.log("data", data);

  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });
    router.push("/");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/forum" className="text-2xl font-bold text-primary">
          Forum Hub
        </Link>

        <div className="flex items-center gap-4">
          <NotificationDropdown data={data} isLoading={isLoading} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarFallback>
                    {userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2 text-sm text-muted-foreground border-b">
                {userName}
              </div>
              <DropdownMenuLink href="/forum/profile">
                <UserIcon className="w-4 h-4" /> Profile
              </DropdownMenuLink>
              {/* <DropdownMenuLink href="/forum/settings">
                <Settings className="w-4 h-4" /> Settings
              </DropdownMenuLink> */}
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <NotificationToast refetch={refetch} />
      </div>
    </nav>
  );
}

function DropdownMenuLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <div className="px-2 py-1.5 text-sm flex items-center gap-2 hover:bg-accent rounded cursor-pointer">
        {children}
      </div>
    </Link>
  );
}
