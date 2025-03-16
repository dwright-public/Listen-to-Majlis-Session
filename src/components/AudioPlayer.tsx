import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";

interface AudioPlayerProps {
  sessionTitle?: string;
  sessionLocation?: string;
  startTime?: Date;
  audioUrl?: string;
  isLive?: boolean;
  onClose?: () => void;
}

const AudioPlayer = ({
  sessionTitle = "Morning Meditation",
  sessionLocation = "Tokyo, Japan",
  startTime = new Date(Date.now() + 4 * 60 * 1000), // 4 minutes from now by default
  audioUrl = "https://example.com/stream",
  isLive = false,
  onClose = () => {},
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<string>("");
  const [status, setStatus] = useState<"starting-soon" | "live" | "ended">(
    "starting-soon",
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(audioUrl);
    audioRef.current.volume = volume / 100;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && status === "live") {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, status]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Update countdown and status
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = startTime.getTime() - now.getTime();

      if (diff <= 0) {
        // Session has started
        setStatus("live");
        setCountdown("LIVE NOW");
        // Auto-play when session starts
        if (!isPlaying && audioRef.current) {
          setIsPlaying(true);
        }
      } else if (diff <= 5 * 60 * 1000) {
        // Less than 5 minutes to start
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCountdown(
          `Starting in ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`,
        );
        setStatus("starting-soon");
      } else {
        // More than 5 minutes to start
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setCountdown(`Starts in ${hours}h ${minutes}m`);
        setStatus("starting-soon");
      }
    };

    // Set initial status based on props
    if (isLive) {
      setStatus("live");
      setCountdown("LIVE NOW");
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [startTime, isLive, isPlaying]);

  const togglePlayPause = () => {
    if (status === "live") {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (isMuted && value[0] > 0) {
      setIsMuted(false);
    }
  };

  return (
    <Card className="w-full max-w-[800px] bg-white shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">{sessionTitle}</CardTitle>
            <CardDescription className="text-sm">
              {sessionLocation}
            </CardDescription>
          </div>
          <Badge
            variant={status === "live" ? "destructive" : "outline"}
            className="px-3 py-1"
          >
            {status === "live" ? "LIVE NOW" : countdown}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex items-center justify-center space-x-6 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={togglePlayPause}
            disabled={status !== "live"}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          {status === "starting-soon" && (
            <div className="flex items-center text-amber-600">
              <Clock className="mr-2 h-5 w-5" />
              <span className="text-lg font-medium">{countdown}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            defaultValue={[volume]}
            max={100}
            step={1}
            value={[volume]}
            onValueChange={handleVolumeChange}
            className="w-[200px]"
          />
          <span className="text-xs w-8 text-center">{volume}%</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between">
        <div className="text-xs text-muted-foreground">
          {status === "live"
            ? "Streaming live"
            : "Audio will begin automatically when the session starts"}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AudioPlayer;
