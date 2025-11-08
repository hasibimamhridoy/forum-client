"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Check, Trash2 } from "lucide-react";
import Link from "next/link";

export function NotificationList({ notifications }: { notifications: any[] }) {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification: any) => (
        <Card
          key={notification._id}
          className={notification.isRead ? "opacity-60" : ""}
        >
          <CardContent className="p-6">
            <div className="flex gap-4">
              {notification.sender && (
                <Avatar>
                  <AvatarFallback>
                    {notification.sender.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm">{notification.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <Badge variant="default" className="text-xs">
                        New
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {notification.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {notification.relatedThread && (
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/forum/threads/${notification.relatedThread}`}
                      >
                        View Thread
                      </Link>
                    </Button>
                  )}
                  {!notification.isRead && (
                    // onClick={() => markAsRead(notification._id)}
                    <Button variant="ghost" size="sm">
                      <Check className="mr-2 h-4 w-4" />
                      Mark as read
                    </Button>
                  )}
                  {/* onClick={() => deleteNotification(notification._id)} */}
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
