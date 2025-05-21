"use client";

import type { TimestampEntry } from "@/types";
import { TimestampItem } from "@/components/TimestampItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TimestampListProps {
  timestamps: TimestampEntry[];
  onDescribe: (id: string) => void;
  onCopy: (entry: TimestampEntry) => void;
  onDelete: (id: string) => void;
  currentlyGeneratingId: string | null;
}

export function TimestampList({
  timestamps,
  onDescribe,
  onCopy,
  onDelete,
  currentlyGeneratingId,
}: TimestampListProps) {

  return (
    <Card className="flex-grow flex flex-col bg-card shadow-md">
      <CardHeader className="sticky top-0 bg-card z-10 border-b">
        <CardTitle className="text-lg text-card-foreground">Marcas de Tiempo</CardTitle>
        {timestamps.length === 0 && (
          <CardDescription className="text-sm text-muted-foreground pt-1">
            Aún no hay marcas de tiempo. Añade algunas desde el video.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        {timestamps.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <p className="text-muted-foreground text-center">
              Reproduce el video y haz clic en "Añadir Marca de Tiempo" para comenzar.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {timestamps.map((entry) => (
                <TimestampItem
                  key={entry.id}
                  timestampEntry={entry}
                  onDescribe={onDescribe}
                  onCopy={onCopy}
                  onDelete={onDelete}
                  isGeneratingDescription={currentlyGeneratingId === entry.id}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
