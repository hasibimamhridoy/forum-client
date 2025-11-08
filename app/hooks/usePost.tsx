"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSocket } from "../lib/socket";

interface OptimisticPost {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  isEdited: boolean;
  isFlagged: boolean;
  thread: string;
  parentPost?: { _id: string } | null;
  isOptimistic?: boolean;
  isPending?: boolean;
}

interface UseOptimisticPostsProps {
  threadId: string;
  initialPosts: OptimisticPost[];
}

export function useOptimisticPosts({
  threadId,
  initialPosts,
}: UseOptimisticPostsProps) {
  const [posts, setPosts] = useState<OptimisticPost[]>(initialPosts);
  const socket = useSocket();

  const pendingOperations = useRef(new Map<string, NodeJS.Timeout>());

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const addPostOptimistically = useCallback(
    (post: OptimisticPost) => {
      const optimisticPost = {
        ...post,
        isOptimistic: true,
        isPending: true,
      };

      setPosts((prev) => [...prev, optimisticPost]);

      const timeoutId = setTimeout(() => {
        setPosts((prev) => prev.filter((p) => p._id !== post._id));
        toast("Error");
      }, 10000); // 10 second timeout

      pendingOperations.current.set(post._id, timeoutId);

      if (socket) {
        socket.emit("post:create-optimistic", {
          ...post,
          threadId,
        });
      }

      return optimisticPost;
    },
    [socket, threadId, toast]
  );

  const updatePostOptimistically = useCallback(
    (postId: string, updates: Partial<OptimisticPost>) => {
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, ...updates, isEdited: true, isPending: true }
            : post
        )
      );

      if (socket) {
        socket.emit("post:update-optimistic", {
          _id: postId,
          ...updates,
          threadId,
        });
      }

      const timeoutId = setTimeout(() => {
        toast("Error");
      }, 10000);

      pendingOperations.current.set(`update-${postId}`, timeoutId);
    },
    [socket, threadId, toast]
  );

  const deletePostOptimistically = useCallback(
    (postId: string, childIds: string[] = []) => {
      const allIds = [postId, ...childIds];

      const deletedPosts = posts.filter((p) => allIds.includes(p._id));

      setPosts((prev) => prev.filter((post) => !allIds.includes(post._id)));

      if (socket) {
        socket.emit("post:delete-optimistic", {
          postId,
          threadId,
          deletedIds: allIds,
        });
      }

      const timeoutId = setTimeout(() => {
        setPosts((prev) => [...prev, ...deletedPosts]);
        toast("Error");
      }, 10000);

      pendingOperations.current.set(`delete-${postId}`, timeoutId);
    },
    [posts, socket, threadId, toast]
  );

  const confirmPostCreated = useCallback((post: OptimisticPost) => {
    const timeoutId = pendingOperations.current.get(post._id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      pendingOperations.current.delete(post._id);
    }

    setPosts((prev) => {
      const existingIndex = prev.findIndex((p) => p._id === post._id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...post,
          isOptimistic: false,
          isPending: false,
        };
        return updated;
      }
      return [...prev, { ...post, isOptimistic: false, isPending: false }];
    });
  }, []);

  const confirmPostUpdated = useCallback((post: OptimisticPost) => {
    const timeoutId = pendingOperations.current.get(`update-${post._id}`);
    if (timeoutId) {
      clearTimeout(timeoutId);
      pendingOperations.current.delete(`update-${post._id}`);
    }

    setPosts((prev) =>
      prev.map((p) => (p._id === post._id ? { ...post, isPending: false } : p))
    );
  }, []);

  const confirmPostDeleted = useCallback(
    (data: { postId?: string; deletedIds?: string[]; id?: string }) => {
      const deletedIds = data.deletedIds || [data.postId || data.id];

      const timeoutId = pendingOperations.current.get(
        `delete-${deletedIds[0]}`
      );
      if (timeoutId) {
        clearTimeout(timeoutId);
        pendingOperations.current.delete(`delete-${deletedIds[0]}`);
      }

      setPosts((prev) => prev.filter((post) => !deletedIds.includes(post._id)));
    },
    []
  );

  useEffect(() => {
    return () => {
      pendingOperations.current.forEach((timeout) => clearTimeout(timeout));
      pendingOperations.current.clear();
    };
  }, []);

  return {
    posts,
    addPostOptimistically,
    updatePostOptimistically,
    deletePostOptimistically,
    confirmPostCreated,
    confirmPostUpdated,
    confirmPostDeleted,
  };
}
