"use client";

import useAuth from "@/app/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCreateFlagMutation,
  useCreateUnFlagMutation,
} from "@/redux/admin/api";
import { useDeletePostMutation } from "@/redux/posts/api";
import { formatDistanceToNow } from "date-fns";
import {
  Flag,
  FlagIcon,
  Loader2,
  MoreVertical,
  Pencil,
  Reply,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CreatePostForm } from "./create-post-form";
import { EditPostDialog } from "./edit-post-dialog";

interface PostAuthor {
  _id: string;
  username: string;
  avatar?: string;
}

interface ParentPost {
  _id: string;
  content: string;
  author: string | PostAuthor;
}

interface Post {
  _id: string;
  content: string;
  author: PostAuthor;
  createdAt: string;
  isEdited: boolean;
  isFlagged: boolean;
  parentPost?: ParentPost | null;
}

interface PostWithChildren extends Post {
  children: PostWithChildren[];
}

interface PostListProps {
  posts: Post[];
  threadId: string;
}

function buildPostTree(posts: Post[]): PostWithChildren[] {
  const postMap = new Map<string, PostWithChildren>();
  const rootPosts: PostWithChildren[] = [];

  // Initialize all posts with empty children array
  posts.forEach((post) => {
    postMap.set(post._id, { ...post, children: [] });
  });

  // Build the tree structure
  posts.forEach((post) => {
    const postWithChildren = postMap.get(post._id)!;

    if (!post.parentPost || !post.parentPost._id) {
      // This is a root post
      rootPosts.push(postWithChildren);
    } else {
      // This is a reply, add it to parent's children
      const parent = postMap.get(post.parentPost._id);
      if (parent) {
        parent.children.push(postWithChildren);
      } else {
        // Parent not found, treat as root
        rootPosts.push(postWithChildren);
      }
    }
  });

  return rootPosts;
}

function NestedPost({
  post,
  threadId,
  depth = 0,
  isLast = false,
  parentLines = [],
}: {
  post: PostWithChildren;
  threadId: string;
  depth?: number;
  isLast?: boolean;
  parentLines?: boolean[];
}) {
  const [replyingTo, setReplyingTo] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const hasChildren = post.children.length > 0;
  const { userId, role } = useAuth();

  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [flagPost, { isLoading: isFlagging }] = useCreateFlagMutation();
  const [unFlagPost, { isLoading: isUnFlagging }] = useCreateUnFlagMutation();

  const canModify = userId === post.author?._id || role === "admin";

  const handleDelete = async () => {
    try {
      await deletePost(post._id).unwrap();
      toast("Post deleted", {
        description: "The post has been deleted successfully",
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      toast("Failed to delete post", {
        description: "An error occurred while deleting the post",
      });
    }
  };

  const handleFlag = async () => {
    try {
      await flagPost({
        postId: post._id,
        reason: "Inappropriate content",
      }).unwrap();
      toast("Post flagged", {
        description: "The post has been flagged for review",
      });
    } catch (error) {
      toast("Failed to flag post", {
        description: "An error occurred while flagging the post",
      });
    }
  };
  const handleUnFlag = async () => {
    try {
      await unFlagPost({
        postId: post._id,
      }).unwrap();
      toast("Post unflagged", {
        description: "The post has been unflagged",
      });
    } catch (error) {
      toast("Failed to unflag post", {
        description: "An error occurred while unflagging the post",
      });
    }
  };

  return (
    <div className="relative">
      {depth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex">
          {parentLines.map((shouldDraw, index) => (
            <div key={index} className="w-12 relative">
              {shouldDraw && (
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
              )}
            </div>
          ))}
          <div className="w-12 relative">
            {!isLast && (
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            )}
            <svg
              className="absolute left-6 top-6"
              width="24"
              height="2"
              viewBox="0 0 24 2"
              fill="none"
            >
              <line
                x1="0"
                y1="1"
                x2="24"
                y2="1"
                stroke="currentColor"
                strokeWidth="1"
                className="text-border"
              />
            </svg>
            <svg
              className="absolute left-6 top-0"
              width="2"
              height="24"
              viewBox="0 0 2 24"
              fill="none"
            >
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="24"
                stroke="currentColor"
                strokeWidth="1"
                className="text-border"
              />
            </svg>
          </div>
        </div>
      )}

      <div
        className="relative"
        style={{ marginLeft: depth > 0 ? `${depth * 48}px` : "0" }}
      >
        <Card className="mb-3 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm">
                  {post.author?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">
                    {post.author?.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {post.isEdited && (
                    <Badge variant="outline" className="text-xs">
                      Edited
                    </Badge>
                  )}
                  {post.isFlagged && (
                    <Badge variant="destructive" className="text-xs">
                      <Flag className="h-3 w-3 mr-1" />
                      Flagged
                    </Badge>
                  )}
                  {canModify && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 ml-auto"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditDialogOpen(true)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteDialogOpen(true)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          // onClick={() => setDeleteDialogOpen(true)}
                          onClick={handleFlag}
                          className="text-destructive focus:text-destructive"
                        >
                          <FlagIcon className="mr-2 h-4 w-4" />
                          Flag
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          // onClick={() => setDeleteDialogOpen(true)}
                          onClick={handleUnFlag}
                          className="text-green-500"
                        >
                          <FlagIcon className="mr-2 h-4 w-4 text-green-500" />
                          UnFlag
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap wrap-break-word">
                  {post.content}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setReplyingTo(!replyingTo)}
                  >
                    <Reply className="mr-1.5 h-3.5 w-3.5" />
                    Reply
                  </Button>
                  {hasChildren && (
                    <span className="text-xs text-muted-foreground">
                      {post.children.length}{" "}
                      {post.children.length === 1 ? "reply" : "replies"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {replyingTo && (
          <div className="mb-4 ml-12">
            <CreatePostForm
              threadId={threadId}
              parentPostId={post._id}
              onSuccess={() => setReplyingTo(false)}
            />
          </div>
        )}
      </div>

      {hasChildren && (
        <div>
          {post.children.map((child, index) => (
            <NestedPost
              key={child._id}
              post={child}
              threadId={threadId}
              depth={depth + 1}
              isLast={index === post.children.length - 1}
              parentLines={[...parentLines, !isLast]}
            />
          ))}
        </div>
      )}

      <EditPostDialog
        post={{ _id: post._id, content: post.content, thread: threadId }}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              {hasChildren ? (
                <>
                  This post has <strong>{post.children.length}</strong>{" "}
                  {post.children.length === 1 ? "reply" : "replies"}. Deleting
                  this post will also delete all replies. This action cannot be
                  undone.
                </>
              ) : (
                "Are you sure you want to delete this post? This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete {hasChildren && "All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function PostList({ posts, threadId }: PostListProps) {
  const postTree = useMemo(() => buildPostTree(posts), [posts]);

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No replies yet. Be the first to reply!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {postTree.map((post, index) => (
        <NestedPost
          key={post._id}
          post={post}
          threadId={threadId}
          depth={0}
          isLast={index === postTree.length - 1}
          parentLines={[]}
        />
      ))}
    </div>
  );
}
