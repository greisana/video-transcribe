"use client";

import type { TimestampEntry } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";
import { Copy, Sparkles, Trash2, Loader2 } from "lucide-react";

interface TimestampItemProps {
  timestampEntry: TimestampEntry;
  onDescribe: (id: string) => void;
  onCopy: (entry: TimestampEntry) => void;
  onDelete: (id: string) => void;
  isGeneratingDescription: boolean;
}

export function TimestampItem({
  timestampEntry,
  onDescribe,
  onCopy,
  onDelete,
  isGeneratingDescription,
}: TimestampItemProps) {
  return (
    <Card className="mb-3 shadow-sm break-inside-avoid bg-card">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-semibold text-card-foreground">
          Timestamp: {formatTime(timestampEntry.time)}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 min-h-[40px]">
        {isGeneratingDescription ? (
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
            Generating description...
          </div>
        ) : timestampEntry.description ? (
          <CardDescription className="text-sm whitespace-pre-wrap text-card-foreground/90">
            {timestampEntry.description}
          </CardDescription>
        ) : (
          <CardDescription className="text-sm italic text-muted-foreground">
            No description yet. Click "Describe" to generate one.
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 px-4 pb-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDescribe(timestampEntry.id)}
          aria-label={timestampEntry.description ? "Regenerate description" : "Generate description"}
          title={timestampEntry.description ? "Regenerate description" : "Generate description"}
          disabled={isGeneratingDescription}
          className="hover:bg-accent/10 hover:text-accent-foreground"
        >
          {isGeneratingDescription ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-1.5 h-4 w-4" />
          )}
          {isGeneratingDescription ? 'Generating...' : (timestampEntry.description ? 'Re-Describe' : 'Describe')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCopy(timestampEntry)}
          aria-label="Copy timestamp and description"
          title="Copy timestamp and description"
          className="hover:bg-accent/10 hover:text-accent-foreground"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(timestampEntry.id)}
          aria-label="Delete timestamp"
          title="Delete timestamp"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
