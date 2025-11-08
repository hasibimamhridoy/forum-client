"use client";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSocketEvent } from "../lib/socket";

interface NotificationData {
  _id: string;
  recipient: string;
  sender?: {
    _id: string;
    username: string;
    avatar?: string;
  };
  type: "mention" | "reply" | "thread_update" | "system";
  content: string;
  relatedThread?: string;
  relatedPost?: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationToast({ refetch }: { refetch: () => void }) {
  const router = useRouter();

  useSocketEvent("notification:new", (data: NotificationData) => {
    console.log("[v0] Notification received:", data);

    // dispatch(
    //     notificationsApi.util.updateQueryData(
    //     "getNotifications",
    //     { page: 1, limit: 20 },
    //     (draft: any) => {
    //       if (draft?.data) {
    //         // Add new notification to the beginning
    //         draft.data.notifications = [
    //           data,
    //           ...(draft.data.notifications || []),
    //         ];
    //         // Increment unread count
    //         draft.data.unreadCount = (draft.data.unreadCount || 0) + 1;
    //       }
    //     }
    //   )
    // );

    // dispatch(
    //   forumApi.util.updateQueryData(
    //     "getNotifications",
    //     { page: 1, limit: 20, unreadOnly: true },
    //     (draft: any) => {
    //       if (draft?.data && !data.isRead) {
    //         draft.data.notifications = [
    //           data,
    //           ...(draft.data.notifications || []),
    //         ];
    //         draft.data.unreadCount = (draft.data.unreadCount || 0) + 1;
    //       }
    //     }
    //   )
    // );

    toast(data.content, {
      icon: <Bell className="h-4 w-4" />,
      description: data.sender?.username
        ? `From ${data.sender.username} : ${data.content}`
        : undefined,
      action: data.relatedThread
        ? {
            label: "View",
            onClick: () => {
              //   router.push(`/forum/threads/${data.relatedThread}`);
              window.location.href = `/forum/threads/${data.relatedThread}`;
            },
          }
        : undefined,
      duration: 7000,
    });

    refetch();

    if (typeof window !== "undefined" && "Audio" in window) {
      try {
        const audio = new Audio("/notification-sound.mp3");
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Ignore audio play errors (user interaction required)
        });
      } catch (error) {
        // Ignore audio errors
      }
    }
  });

  return null;
}
