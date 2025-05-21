"use client";

import type React from "react";
import { useCallback, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadProps {
  onVideoSelect: (file: File) => void;
}

export function VideoUpload({ onVideoSelect }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        onVideoSelect(file);
      } else {
        toast({
          title: "Tipo de Archivo Inválido",
          description: "Por favor, sube un archivo de video válido.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) {
        if (file.type.startsWith("video/")) {
          onVideoSelect(file);
        } else {
          toast({
            title: "Tipo de Archivo Inválido",
            description: "Por favor, sube un archivo de video válido.",
            variant: "destructive",
          });
        }
      }
    },
    [onVideoSelect, toast]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
        setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <Card 
      className={`w-full max-w-lg mx-auto border-2 border-dashed transition-colors duration-200 ease-in-out ${isDragging ? "border-primary bg-accent/10" : "border-border hover:border-primary/50"}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      data-ai-hint="video upload"
    >
      <CardHeader className="text-center">
        <UploadCloud className="mx-auto h-16 w-16 text-muted-foreground" />
        <CardTitle className="mt-4 text-xl">Sube Tu Video</CardTitle>
        <CardDescription>Arrastra y suelta un archivo de video aquí, o haz clic para seleccionar</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4 p-6 pt-2">
        <Input
          id="video-upload-input"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button asChild variant="default" size="lg">
          <label htmlFor="video-upload-input" className="cursor-pointer">
            Seleccionar Archivo
          </label>
        </Button>
         <p className="text-xs text-muted-foreground">Compatible con MP4, WebM, Ogg, etc.</p>
      </CardContent>
    </Card>
  );
}
