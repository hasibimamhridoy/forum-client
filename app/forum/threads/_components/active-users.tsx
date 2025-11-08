"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { ActiveUser } from "./thread-view";

interface ActiveUsersProps {
  threadId: string;
}
interface ActiveUserProps {
  activeUsers: ActiveUser[];
}

export function ActiveUsers({ activeUsers }: ActiveUserProps) {
  // const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  // const socket = useSocket();

  // useEffect(() => {
  //   if (socket && socket.connected && threadId) {
  //     console.log("[v0] ActiveUsers mounted, requesting current users");
  //     socket.emit("thread:request-users", threadId);
  //   }
  // }, [socket, threadId]);

  // useSocketEvent(
  //   "thread:users",
  //   (data: { threadId: string; users: ActiveUser[] }) => {
  //     if (data.threadId === threadId) {
  //       console.log("[v0] Active users updated:", data.users);
  //       setActiveUsers(data.users);
  //     }
  //   }
  // );

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" />
          Active Users
          <Badge variant="secondary" className="ml-auto">
            {activeUsers.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No active users
          </p>
        ) : (
          <div className="space-y-3">
            {activeUsers.map((user) => (
              <div key={user.socketId} className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {user.username[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-muted-foreground">Viewing now</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
