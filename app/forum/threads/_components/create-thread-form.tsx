"use client";

import { useCreateThreadMutation } from "@/redux/threads/api";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

import { useSocket } from "@/app/lib/socket";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function CreateThreadForm() {
  const router = useRouter();
  const [createThread, { isLoading }] = useCreateThreadMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {}
  );
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required.";
    } else if (title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters long.";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required.";
    } else if (content.trim().length < 10) {
      newErrors.content = "Content must be at least 10 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const socket = useSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await createThread({
        title,
        content,
        category: category || undefined,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      }).unwrap();

      socket?.emit("thread:created", result.data);
      toast.success("Thread created successfully!");
      router.push(`/forum/threads/${result?.data?._id}`);
      // router.refresh(); // Forces revalidation of current route (not a full reload)
      // window.location.href = `/forum/threads/${result?.data?._id}`;
    } catch (error: any) {
      const message =
        error?.data?.message || "Failed to create thread. Please try again.";

      toast.error(message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Thread</CardTitle>
        <CardDescription>Start a new discussion topic</CardDescription>
      </CardHeader>

      <CardContent>
        <Alert className="mb-6">
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            Your content will be automatically checked by our AI moderation
            system to ensure community guidelines are followed.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter thread title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) validateForm();
              }}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-1">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Write your post content..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) validateForm();
              }}
              rows={8}
              disabled={isLoading}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., General, Tech, Gaming..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Comma-separated tags (e.g., javascript, react, help)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Thread"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
