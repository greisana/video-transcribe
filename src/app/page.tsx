"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VideoUpload } from "@/components/VideoUpload";
import { VideoPlayer } from "@/components/VideoPlayer";
import { TimestampList } from "@/components/TimestampList";
import type { TimestampEntry } from "@/types";
import { readFileAsDataURL, formatTime } from "@/lib/utils";
import { autoDescribeTimestamp, type AutoDescribeTimestampInput } from "@/ai/flows/auto-describe-timestamp";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2, Film } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [timestamps, setTimestamps] = useState<TimestampEntry[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentlyGeneratingId, setCurrentlyGeneratingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleVideoSelect = useCallback(async (file: File) => {
    setIsUploading(true);
    setIsVideoReady(false);
    setVideoFile(file);
    try {
      const dataUrl = await readFileAsDataURL(file);
      setVideoSrc(dataUrl);
      setTimestamps([]);
      setCurrentTime(0);
    } catch (error) {
      console.error("Error reading video file:", error);
      toast({
        title: "Error Uploading Video",
        description: "Could not read the video file. Please try again.",
        variant: "destructive",
      });
      setVideoFile(null);
      setVideoSrc(null);
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    setIsVideoReady(true);
    if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime); // Ensure current time is updated once ready
    }
  }, []);

  const handleAddTimestamp = useCallback(() => {
    if (!videoRef.current || !isVideoReady) return;
    const newTimestampTime = videoRef.current.currentTime;
    
    // Prevent adding duplicate timestamps at the exact same millisecond
    if (timestamps.some(ts => Math.abs(ts.time - newTimestampTime) < 0.01)) {
      toast({
        title: "Timestamp Exists",
        description: `A timestamp at ${formatTime(newTimestampTime)} already exists.`,
        variant: "default",
      });
      return;
    }

    const newTimestamp: TimestampEntry = {
      id: crypto.randomUUID(),
      time: newTimestampTime,
      description: "",
    };
    setTimestamps((prev) => [...prev, newTimestamp].sort((a,b) => a.time - b.time));
    toast({
      title: "Timestamp Added",
      description: `Added timestamp at ${formatTime(newTimestamp.time)}`,
    });
  }, [toast, isVideoReady, timestamps]);

  const handleAutoDescribe = useCallback(async (id: string) => {
    if (!videoSrc) {
      toast({ title: "Error", description: "No video loaded.", variant: "destructive" });
      return;
    }
    const timestampToDescribe = timestamps.find(ts => ts.id === id);
    if (!timestampToDescribe) {
      toast({ title: "Error", description: "Timestamp not found.", variant: "destructive" });
      return;
    }

    setCurrentlyGeneratingId(id);
    try {
      const previousTimestampsForAI = timestamps
        .filter(ts => ts.id !== id && ts.description)
        .map(ts => ({ timestamp: ts.time, description: ts.description }));

      const input: AutoDescribeTimestampInput = {
        videoDataUri: videoSrc,
        timestamp: timestampToDescribe.time,
        previousTimestamps: previousTimestampsForAI,
      };
      
      const result = await autoDescribeTimestamp(input);
      
      setTimestamps(prev =>
        prev.map(ts =>
          ts.id === id ? { ...ts, description: result.description } : ts
        )
      );
      toast({
        title: "Description Generated",
        description: `AI description added for ${formatTime(timestampToDescribe.time)}`,
      });
    } catch (error) {
      console.error("Error generating description:", error);
      let errorMessage = "Could not generate description. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "AI Description Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setCurrentlyGeneratingId(null);
    }
  }, [videoSrc, timestamps, toast]);

  const handleCopyToClipboard = useCallback((entry: TimestampEntry) => {
    const textToCopy = `Timestamp: ${formatTime(entry.time)}\nDescription: ${entry.description || "N/A"}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({ title: "Copied!", description: "Timestamp copied to clipboard." });
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        toast({ title: "Copy Failed", description: "Could not copy to clipboard.", variant: "destructive" });
      });
  }, [toast]);

  const handleDeleteTimestamp = useCallback((id: string) => {
    setTimestamps(prev => prev.filter(ts => ts.id !== id));
    toast({ title: "Timestamp Deleted", variant: "default" });
  }, [toast]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="p-4 border-b border-border shadow-sm bg-card sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between max-w-7xl px-4">
          <div className="flex items-center space-x-3">
            <Film className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">NoCodeVidEdit</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-2/3 p-4 md:p-6 flex flex-col space-y-4 overflow-y-auto">
          {!videoSrc ? (
            <div className="flex-grow flex items-center justify-center">
              {isUploading ? (
                <Card className="w-full max-w-lg mx-auto shadow-lg">
                  <CardContent className="p-10 flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground text-lg">Processing video...</p>
                  </CardContent>
                </Card>
              ) : (
                <VideoUpload onVideoSelect={handleVideoSelect} />
              )}
            </div>
          ) : (
            <div className="flex flex-col space-y-4 flex-grow">
              <VideoPlayer 
                videoSrc={videoSrc} 
                videoRef={videoRef} 
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
              <div className="flex items-center justify-center p-2 bg-card rounded-lg shadow-md">
                <Button 
                  onClick={handleAddTimestamp} 
                  disabled={!isVideoReady || currentlyGeneratingId !== null || isUploading}
                  className="flex-grow md:flex-none"
                  variant="default"
                  size="lg"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add Timestamp at {formatTime(currentTime)}
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className="w-full md:w-1/3 p-4 md:p-6 border-t md:border-t-0 md:border-l border-border flex flex-col overflow-y-auto bg-background md:bg-muted/20">
          <TimestampList
            timestamps={timestamps}
            onDescribe={handleAutoDescribe}
            onCopy={handleCopyToClipboard}
            onDelete={handleDeleteTimestamp}
            currentlyGeneratingId={currentlyGeneratingId}
          />
        </aside>
      </main>
    </div>
  );
}
