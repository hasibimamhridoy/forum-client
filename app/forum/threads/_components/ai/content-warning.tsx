"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ContentWarningProps {
  isFlagged: boolean;
  flagReason?: string;
}

export function ContentWarning({ isFlagged, flagReason }: ContentWarningProps) {
  if (!isFlagged) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Content Flagged</AlertTitle>
      <AlertDescription>
        {flagReason ||
          "This content has been flagged by our AI moderation system for review."}
      </AlertDescription>
    </Alert>
  );
}
