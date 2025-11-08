"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useUpdatePostMutation } from "@/redux/posts/api";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface EditPostDialogProps {
  post: {
    _id: string;
    content: string;
    thread: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPostDialog({
  post,
  open,
  onOpenChange,
}: EditPostDialogProps) {
  const [content, setContent] = useState(post.content);
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setContent(post.content);
    }
  }, [open, post.content]);

  useEffect(() => {
    if (open && textareaRef.current) {
      const timer = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const length = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(length, length);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleTextareaFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const length = e.target.value.length;
    e.target.setSelectionRange(length, length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    try {
      await updatePost({
        id: post._id,
        content,
        threadId: post.thread,
      }).unwrap();

      toast.success("Post updated successfully", {
        description: "Your changes have been saved",
      });

      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update post", {
        description: "An error occurred while updating the post",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your post. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleTextareaFocus}
              placeholder="Edit your post..."
              className="min-h-[200px]"
              disabled={isLoading}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
