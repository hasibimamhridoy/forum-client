"use client";

import type React from "react";

import useAuth from "@/app/hooks/useAuth";
import { useSocket } from "@/app/lib/socket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePostMutation } from "@/redux/threads/api";
import { useEffect, useState } from "react";

interface CreatePostFormProps {
  threadId: string;
  parentPostId?: string;
  onSuccess?: () => void;
}

export function CreatePostForm({
  threadId,
  parentPostId,
  onSuccess,
}: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [createPost, { isLoading }] = useCreatePostMutation();
  const { userId } = useAuth();
  //   const { toast } = useToast()
  const socket = useSocket();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket) return;

    let timeout: NodeJS.Timeout;

    if (content && !isTyping) {
      socket.emit("typing:start", threadId);
      setIsTyping(true);
    }

    if (content) {
      timeout = setTimeout(() => {
        socket.emit("typing:stop", threadId);
        setIsTyping(false);
      }, 2000);
    } else if (isTyping) {
      socket.emit("typing:stop", threadId);
      setIsTyping(false);
    }

    return () => {
      clearTimeout(timeout);
      if (isTyping) {
        socket.emit("typing:stop", threadId);
      }
    };
  }, [content, socket, threadId, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      //   toast({
      //     title: "Error",
      //     description: "Please enter a message",
      //     variant: "destructive",
      //   })
      alert("Please enter a message");
      return;
    }

    try {
      await createPost({
        author: userId,
        content,
        threadId,
        parentPostId,
      }).unwrap();

      setContent("");
      if (socket && isTyping) {
        socket.emit("typing:stop", threadId);
        setIsTyping(false);
      }

      socket?.emit("notification:new", { threadId });
      //   toast({
      //     title: "Success",
      //     description: "Reply posted successfully",
      //   })
      // alert("Reply posted successfully");
      onSuccess?.();
    } catch (error: any) {
      //   toast({
      //     title: "Error",
      //     description: error.data?.error || "Failed to post reply",
      //     variant: "destructive",
      //   })
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{parentPostId ? "Reply to Post" : "Post a Reply"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Write your reply..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            disabled={isLoading}
          />
          <div className="flex justify-end gap-2">
            {parentPostId && (
              <Button type="button" variant="outline" onClick={onSuccess}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Posting..." : "Post Reply"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
