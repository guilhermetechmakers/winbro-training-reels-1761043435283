/**
 * VideoPlayer Component
 * Advanced video player with HLS support, quality selection, and transcript sync
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, Minimize, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { VideoPlayerState, VideoPlayerControls } from '@/types/video';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  duration?: number;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onQualityChange?: (quality: string) => void;
  onPictureInPictureChange?: (isPictureInPicture: boolean) => void;
  className?: string;
  showControls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playbackRates?: number[];
  qualities?: string[];
  currentQuality?: string;
  currentPlaybackRate?: number;
  currentTime?: number;
  isPlaying?: boolean;
  isLoading?: boolean;
  error?: string;
}

const VideoPlayer = React.forwardRef<VideoPlayerControls, VideoPlayerProps>(({
  src,
  poster,
  title,
  duration,
  onTimeUpdate,
  onDurationChange,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onPlaybackRateChange,
  onQualityChange,
  className,
  showControls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2],
  qualities = ['auto', '720p', '480p', '360p'],
  currentQuality = 'auto',
  currentPlaybackRate = 1,
  currentTime = 0,
  isPlaying = false,
  isLoading = false,
  error,
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying,
    currentTime,
    duration: duration || 0,
    volume: muted ? 0 : 1,
    playbackRate: currentPlaybackRate,
    quality: currentQuality,
    isFullscreen: false,
    isPictureInPicture: false,
    isMuted: muted,
    isLoading,
    error,
  });

  const [showSettings, setShowSettings] = useState(false);

  // Update player state when props change
  useEffect(() => {
    setPlayerState(prev => ({
      ...prev,
      isPlaying,
      currentTime,
      duration: duration || prev.duration,
      playbackRate: currentPlaybackRate,
      quality: currentQuality,
      isLoading,
      error,
    }));
  }, [isPlaying, currentTime, duration, currentPlaybackRate, currentQuality, isLoading, error]);

  // Video event handlers
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setPlayerState(prev => ({ ...prev, duration: videoDuration }));
      onDurationChange?.(videoDuration);
    }
  }, [onDurationChange]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setPlayerState(prev => ({ ...prev, currentTime }));
      onTimeUpdate?.(currentTime);
    }
  }, [onTimeUpdate]);

  const handlePlay = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isPlaying: true }));
    onPlay?.();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
    onPause?.();
  }, [onPause]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setPlayerState(prev => ({ 
        ...prev, 
        volume: newVolume, 
        isMuted: newVolume === 0 
      }));
      onVolumeChange?.(newVolume);
    }
  }, [onVolumeChange]);

  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setPlayerState(prev => ({ ...prev, currentTime: time }));
      onSeek?.(time);
    }
  }, [onSeek]);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlayerState(prev => ({ ...prev, playbackRate: rate }));
      onPlaybackRateChange?.(rate);
    }
  }, [onPlaybackRateChange]);



  // Control functions
  const play = useCallback(() => {
    videoRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const seek = useCallback((time: number) => {
    handleSeek(time);
  }, [handleSeek]);

  const setVolume = useCallback((volume: number) => {
    handleVolumeChange(volume);
  }, [handleVolumeChange]);

  const setPlaybackRate = useCallback((rate: number) => {
    handlePlaybackRateChange(rate);
  }, [handlePlaybackRateChange]);

  const setQuality = useCallback((quality: string) => {
    setPlayerState(prev => ({ ...prev, quality }));
    onQualityChange?.(quality);
  }, [onQualityChange]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, []);

  const togglePictureInPicture = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-Picture error:', error);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const newVolume = playerState.isMuted ? 1 : 0;
    handleVolumeChange(newVolume);
  }, [playerState.isMuted, handleVolumeChange]);

  // Format time helper
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Skip functions
  const skipBackward = useCallback(() => {
    const newTime = Math.max(0, playerState.currentTime - 10);
    handleSeek(newTime);
  }, [playerState.currentTime, handleSeek]);

  const skipForward = useCallback(() => {
    const newTime = Math.min(playerState.duration, playerState.currentTime + 10);
    handleSeek(newTime);
  }, [playerState.currentTime, playerState.duration, handleSeek]);

  // Expose controls to parent
  React.useImperativeHandle(ref, () => ({
    play,
    pause,
    seek,
    setVolume,
    setPlaybackRate,
    setQuality,
    toggleFullscreen,
    togglePictureInPicture,
    toggleMute,
  } as VideoPlayerControls));

  if (error) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted rounded-lg aspect-video",
        className
      )}>
        <div className="text-center">
          <div className="text-destructive mb-2">Error loading video</div>
          <div className="text-sm text-muted-foreground">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black rounded-lg overflow-hidden group",
        playerState.isFullscreen && "fixed inset-0 z-50 rounded-none",
        className
      )}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onVolumeChange={(e) => handleVolumeChange(e.currentTarget.volume)}
      >
        <source src={src} type="application/x-mpegURL" />
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading Overlay */}
      {playerState.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="text-white font-medium text-sm truncate max-w-xs">
                  {title}
                </h3>
              )}
            </div>
            <div className="flex items-center gap-2">
              {playerState.quality !== 'auto' && (
                <Badge variant="secondary" className="text-xs">
                  {playerState.quality}
                </Badge>
              )}
              {playerState.playbackRate !== 1 && (
                <Badge variant="secondary" className="text-xs">
                  {playerState.playbackRate}x
                </Badge>
              )}
            </div>
          </div>

          {/* Center Play Button */}
          {!playerState.isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                className="h-16 w-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                onClick={play}
              >
                <Play className="h-8 w-8 text-white ml-1" />
              </Button>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[playerState.currentTime]}
                max={playerState.duration}
                step={0.1}
                onValueChange={(value: number[]) => handleSeek(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/80 mt-1">
                <span>{formatTime(playerState.currentTime)}</span>
                <span>{formatTime(playerState.duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={playerState.isPlaying ? pause : play}
                >
                  {playerState.isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                {/* Skip Backward */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={skipBackward}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                {/* Skip Forward */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={skipForward}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={toggleMute}
                  >
                    {playerState.isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    value={[playerState.volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value: number[]) => setVolume(value[0] / 100)}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Settings Menu */}
                <div className="relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>

                  {showSettings && (
                    <div className="absolute bottom-10 right-0 bg-black/90 backdrop-blur-sm rounded-lg p-2 min-w-48">
                      {/* Playback Rate */}
                      <div className="mb-2">
                        <div className="text-white text-xs mb-1">Playback Speed</div>
                        <div className="flex gap-1">
                          {playbackRates.map((rate) => (
                            <Button
                              key={rate}
                              size="sm"
                              variant={playerState.playbackRate === rate ? "default" : "ghost"}
                              className="text-white text-xs h-6 px-2"
                              onClick={() => setPlaybackRate(rate)}
                            >
                              {rate}x
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Quality */}
                      <div className="mb-2">
                        <div className="text-white text-xs mb-1">Quality</div>
                        <div className="flex gap-1">
                          {qualities.map((quality) => (
                            <Button
                              key={quality}
                              size="sm"
                              variant={playerState.quality === quality ? "default" : "ghost"}
                              className="text-white text-xs h-6 px-2"
                              onClick={() => setQuality(quality)}
                            >
                              {quality}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Picture in Picture */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={togglePictureInPicture}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                {/* Fullscreen */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={toggleFullscreen}
                >
                  {playerState.isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click to play overlay */}
      {!playerState.isPlaying && showControls && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={play}
        />
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
