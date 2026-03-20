'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoPlayerProps {
  videoUrl: string;
  videoType?: 'youtube' | 'vimeo' | 'upload';
  lessonId: string;
  enrollmentId: string;
  duration?: number;
  lastPosition?: number;
  onProgress?: (data: {
    watchedSeconds: number;
    lastPosition: number;
    percentage: number;
  }) => void;
  onComplete?: () => void;
  onNextLesson?: () => void;
  autoAdvance?: boolean;
  className?: string;
}

export function VideoPlayer({
  videoUrl,
  videoType = 'youtube',
  lessonId,
  enrollmentId,
  duration = 0,
  lastPosition = 0,
  onProgress,
  onComplete,
  onNextLesson,
  autoAdvance = true,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompletedRef = useRef(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(lastPosition);
  const [videoDuration, setVideoDuration] = useState(duration);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [watchedSeconds, setWatchedSeconds] = useState(0);

  const percentage =
    videoDuration > 0 ? Math.round((watchedSeconds / videoDuration) * 100) : 0;

  // Handle progress tracking
  const saveProgress = useCallback(async (watched: number, position: number, pct: number) => {
    if (!enrollmentId || !lessonId) return;

    try {
      await fetch(`/api/progress/${lessonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          watchedSeconds: watched,
          lastPosition: position,
        }),
      });

      onProgress?.({
        watchedSeconds: watched,
        lastPosition: position,
        percentage: pct,
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [enrollmentId, lessonId, onProgress]);

  // Resume from last position on mount
  useEffect(() => {
    if (videoRef.current && lastPosition > 0) {
      videoRef.current.currentTime = lastPosition;
    }
  }, [lastPosition]);

  // Track watched time
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          const time = videoRef.current.currentTime;
          setCurrentTime(time);
          
          // Update watched seconds using functional update
          setWatchedSeconds((prev) => {
            const newWatched = prev + 1;
            const pct = videoDuration > 0 ? Math.round((newWatched / videoDuration) * 100) : 0;

            // Check for completion (90%+ watched)
            if (pct >= 90 && !hasCompletedRef.current) {
              hasCompletedRef.current = true;
              onComplete?.();
              saveProgress(newWatched, time, pct);

              if (autoAdvance && onNextLesson) {
                setShowCompletion(true);
                setTimeout(() => {
                  onNextLesson();
                }, 3000);
              }
            }

            // Save progress every 10 seconds
            if (newWatched % 10 === 0) {
              saveProgress(newWatched, time, pct);
            }

            return newWatched;
          });
        }
      }, 1000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, videoDuration, onComplete, saveProgress, autoAdvance, onNextLesson]);

  // Save progress on unmount
  useEffect(() => {
    return () => {
      saveProgress(watchedSeconds, currentTime, percentage);
    };
  }, [saveProgress, currentTime, percentage, watchedSeconds]);

  // Show/hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  const handlePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoDuration, videoRef.current.currentTime + seconds)
      );
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // For YouTube/Vimeo embeds, render an iframe instead
  if (videoType === 'youtube' || videoType === 'vimeo') {
    const getEmbedUrl = () => {
      if (videoType === 'youtube') {
        // Extract video ID from various YouTube URL formats
        const match = videoUrl.match(
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
        );
        const videoId = match ? match[1] : '';
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${lastPosition}`;
      }
      if (videoType === 'vimeo') {
        const match = videoUrl.match(/vimeo\.com\/(\d+)/);
        const videoId = match ? match[1] : '';
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return videoUrl;
    };

    return (
      <div className={cn('relative aspect-video bg-black rounded-lg overflow-hidden', className)}>
        <iframe
          src={getEmbedUrl()}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Progress tracking limited for embedded videos
        </div>
      </div>
    );
  }

  // Native video player for uploaded videos
  return (
    <div
      className={cn('relative aspect-video bg-black rounded-lg overflow-hidden group', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Video Controls Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Play/Pause Button (Center) */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          {!isPlaying && (
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          )}
        </button>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <input
              type="range"
              min={0}
              max={videoDuration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => skipTime(-10)}
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => skipTime(10)}
              >
                <SkipForward className="w-5 h-5" />
              </Button>

              {/* Volume */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>

              {/* Time */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(videoDuration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Playback Speed */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handlePlaybackRate(0.5)}
                    className={playbackRate === 0.5 ? 'bg-muted' : ''}
                  >
                    0.5x Speed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePlaybackRate(0.75)}
                    className={playbackRate === 0.75 ? 'bg-muted' : ''}
                  >
                    0.75x Speed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePlaybackRate(1)}
                    className={playbackRate === 1 ? 'bg-muted' : ''}
                  >
                    Normal (1x)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePlaybackRate(1.25)}
                    className={playbackRate === 1.25 ? 'bg-muted' : ''}
                  >
                    1.25x Speed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePlaybackRate(1.5)}
                    className={playbackRate === 1.5 ? 'bg-muted' : ''}
                  >
                    1.5x Speed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePlaybackRate(2)}
                    className={playbackRate === 2 ? 'bg-muted' : ''}
                  >
                    2x Speed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator on top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Completion overlay */}
      {showCompletion && autoAdvance && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-card rounded-lg p-6 text-center max-w-sm mx-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-1">Lesson Complete!</h3>
            <p className="text-sm text-muted-foreground">
              Moving to next lesson in 3 seconds...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
