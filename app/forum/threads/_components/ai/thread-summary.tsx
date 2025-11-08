"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLazyGetThreadSummaryQuery } from "@/redux/threads/api";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

interface ThreadSummaryProps {
  threadId: string;
}

export function ThreadSummary({ threadId }: ThreadSummaryProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [getSummary, { data, isLoading, error }] =
    useLazyGetThreadSummaryQuery();

  const handleGetSummary = async () => {
    setShowSummary(true);
    await getSummary(threadId);
  };

  return (
    <div className="space-y-4">
      {!showSummary ? (
        <Button
          onClick={handleGetSummary}
          variant="outline"
          className="w-full bg-transparent"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Generate AI Summary
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>AI-Generated Summary</CardTitle>
            </div>
            <CardDescription>
              Powered by AI to help you catch up quickly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to generate summary. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {data?.data && (
              <>
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-muted-foreground">{data.data.summary}</p>
                </div>

                {data.data.keyPoints && data.data.keyPoints.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Key Points</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {data.data.keyPoints.map(
                        (point: string, index: number) => (
                          <li key={index}>{point}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Sentiment</h3>
                  <Badge
                    variant={
                      data.data.sentiment === "positive"
                        ? "default"
                        : data.data.sentiment === "negative"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {data.data.sentiment}
                  </Badge>
                </div>

                <Button
                  onClick={() => setShowSummary(false)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Hide Summary
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
