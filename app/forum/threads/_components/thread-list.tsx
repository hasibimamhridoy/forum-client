"use client";

import { useSocketEvent } from "@/app/lib/socket";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetThreadsQuery } from "@/redux/threads/api";
import { formatDistanceToNow } from "date-fns";
import { Eye, Pin } from "lucide-react";

interface ThreadListProps {
  search?: string;
  category?: string;
  sort?: string;
}

export function ThreadList({ search, category, sort }: ThreadListProps) {
  const { data, isLoading, error, refetch, isFetching } = useGetThreadsQuery({
    page: 1,
    limit: 20,
    search,
    category,
    sort,
  });

  useSocketEvent("thread:created", () => {
    console.log("thread: thread created event received");
    refetch();
  });

  useSocketEvent("thread:updated", () => {
    refetch();
  });

  useSocketEvent("thread:deleted", () => {
    refetch();
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Failed to load threads
          </p>
        </CardContent>
      </Card>
    );
  }

  console.log("data", data?.data);

  const threads = data?.data?.threads || [];

  console.log("threads", threads);

  if (threads.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No threads found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {threads.map((thread: any) => (
          <a key={thread._id} href={`/forum/threads/${thread._id}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {thread.isPinned && (
                        <Pin className="h-4 w-4 text-primary" />
                      )}
                      <CardTitle className="text-lg">{thread.title}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {thread.content}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback>
                            {thread.author?.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{thread.author?.username}</span>
                      </div>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(thread.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{thread.views}</span>
                      </div>
                    </div>
                  </div>
                  {thread.category && (
                    <Badge variant="secondary">{thread.category}</Badge>
                  )}
                </div>
              </CardHeader>
            </Card>
          </a>
        ))}
      </div>
    </>
  );
}
