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
          Marca de Tiempo: {formatTime(timestampEntry.time)}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 min-h-[40px]">
        {isGeneratingDescription ? (
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
            Generando descripción...
          </div>
        ) : timestampEntry.description ? (
          <CardDescription className="text-sm whitespace-pre-wrap text-card-foreground/90">
            {timestampEntry.description}
          </CardDescription>
        ) : (
          <CardDescription className="text-sm italic text-muted-foreground">
            Aún no hay descripción. Haz clic en "Describir" para generar una.
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 px-4 pb-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDescribe(timestampEntry.id)}
          aria-label={timestampEntry.description ? "Regenerar descripción" : "Generar descripción"}
          title={timestampEntry.description ? "Regenerar descripción" : "Generar descripción"}
          disabled={isGeneratingDescription}
          className="hover:bg-accent/10 hover:text-accent-foreground"
        >
          {isGeneratingDescription ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-1.5 h-4 w-4" />
          )}
          {isGeneratingDescription ? 'Generando...' : (timestampEntry.description ? 'Re-Describir' : 'Describir')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCopy(timestampEntry)}
          aria-label="Copiar marca de tiempo y descripción"
          title="Copiar marca de tiempo y descripción"
          className="hover:bg-accent/10 hover:text-accent-foreground"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(timestampEntry.id)}
          aria-label="Eliminar marca de tiempo"
          title="Eliminar marca de tiempo"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
