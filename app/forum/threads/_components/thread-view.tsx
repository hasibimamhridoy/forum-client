"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Eye, Flag, Lock } from "lucide-react";

import useAuth from "@/app/hooks/useAuth";
import { useSocketEvent, useThreadRoom } from "@/app/lib/socket";
import { useGetPostsQuery } from "@/redux/posts/api";
import { useGetThreadQuery } from "@/redux/threads/api";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { ActiveUsers } from "./active-users";
import { ContentWarning } from "./ai/content-warning";
import { ThreadSummary } from "./ai/thread-summary";
import { CreatePostForm } from "./posts/create-post-form";
import { PostList } from "./posts/post-list";

interface ThreadViewProps {
  threadId: string;
}
export interface ActiveUser {
  userId: string;
  username: string;
  socketId: string;
}

export function ThreadView({ threadId }: ThreadViewProps) {
  const {
    data: threadData,
    isLoading: threadLoading,
    refetch: refetchThread,
  } = useGetThreadQuery(threadId);
  const {
    data: postsData,
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useGetPostsQuery({ threadId, page: 1, limit: 50 });
  const { data: session } = useSession();

  const { role } = useAuth();

  useThreadRoom(threadId);

  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  useSocketEvent(
    "thread:users",
    (data: { threadId: string; users: ActiveUser[] }) => {
      if (data.threadId === threadId) {
        console.log("[v0] Active users updated:", data.users);
        setActiveUsers(data.users);
      }
    }
  );

  const handlePostCreated = useCallback(
    (data: any) => {
      console.log("[v0] Post created event:", data);
      if (data.thread === threadId) {
        refetchPosts();
      }

      console.log("threadid ", threadId);
      if (data._id === threadId) {
        refetchThread();
      }
    },
    [threadId, refetchPosts]
  );

  const handlePostUpdated = useCallback(
    (data: any) => {
      console.log("[v0] Post updated event:", data);
      refetchPosts();
    },
    [refetchPosts]
  );

  const handlePostDeleted = useCallback(
    (data: any) => {
      console.log("[v0] Post deleted event:", data);
      refetchPosts();
    },
    [refetchPosts]
  );

  const handleThreadUpdated = useCallback(
    (data: any) => {
      console.log("[v0] Thread updated event:", data);
      if (data._id === threadId) {
        refetchThread();
      }
    },
    [threadId, refetchThread]
  );

  useSocketEvent("post:created", handlePostCreated);
  useSocketEvent("post:updated", handlePostUpdated);
  useSocketEvent("post:deleted", handlePostDeleted);
  useSocketEvent("thread:updated", handleThreadUpdated);

  if (threadLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const thread = threadData?.data;

  if (!thread) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Thread not found</p>
        </CardContent>
      </Card>
    );
  }

  const canSeeSummary = true;
  // const canSeeSummary = role === "moderator" || role === "admin";

  // console.log("postsData?.data?.", postsData?.data);
  // console.log("canSeeSummary", role);

  console.log("thread ", thread);

  return (
    <div className="space-y-6 flex w-full gap-4">
      <div className="flex-1 space-y-6">
        <ContentWarning
          isFlagged={thread.isFlagged}
          flagReason={thread.flagReason}
        />

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  {thread.isLocked && (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                  {thread.isFlagged && (
                    <Flag className="h-5 w-5 text-destructive" />
                  )}
                  <CardTitle className="text-2xl">{thread.title}</CardTitle>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
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
          <CardContent>
            <p className="whitespace-pre-wrap">{thread.content}</p>
            {thread.tags && thread.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {thread.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <ThreadSummary threadId={threadId} />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Replies</h2>
          {postsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <PostList
              posts={postsData?.data?.posts || []}
              threadId={threadId}
            />
          )}
        </div>

        {!thread.isLocked && <CreatePostForm threadId={threadId} />}
      </div>
      <div className="w-[30%]">
        <ActiveUsers activeUsers={activeUsers} />
      </div>
    </div>
  );
}
