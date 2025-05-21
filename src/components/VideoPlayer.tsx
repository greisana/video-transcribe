"use client";

import type React from "react";
import { useEffect } from "react";

interface VideoPlayerProps {
  videoSrc: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  onTimeUpdate: (time: number) => void;
  onLoadedMetadata: () => void;
}

export function VideoPlayer({ videoSrc, videoRef, onTimeUpdate, onLoadedMetadata }: VideoPlayerProps) {
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      if (videoElement) { // Check if still mounted
        onTimeUpdate(videoElement.currentTime);
      }
    };
    
    const handleLoadedMetadata = () => {
      if (videoElement) { // Check if still mounted
        onLoadedMetadata();
      }
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);

    // When videoSrc changes, update the source and load it.
    if (videoElement.src !== videoSrc) {
        videoElement.src = videoSrc;
        videoElement.load();
    }
    
    return () => {
      if (videoElement) { // Check if still mounted before removing listeners
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, [videoSrc, videoRef, onTimeUpdate, onLoadedMetadata]);

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg data-ai-hint='video player'">
      <video
        ref={videoRef}
        controls
        className="w-full h-full"
        preload="metadata" // ensures metadata (like duration) is loaded quickly
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
