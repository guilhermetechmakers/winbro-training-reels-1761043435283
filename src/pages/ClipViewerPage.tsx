/**
 * ClipViewerPage Component
 * Main page for viewing video clips with all interactive features
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Import clip viewer components
import VideoPlayer from '@/components/clip-viewer/VideoPlayer';
import ClipMetadataPanel from '@/components/clip-viewer/ClipMetadataPanel';
import TranscriptTimestamps from '@/components/clip-viewer/TranscriptTimestamps';
import AnnotationsNotes from '@/components/clip-viewer/AnnotationsNotes';
import ClipActions from '@/components/clip-viewer/ClipActions';
import RelatedClips from '@/components/clip-viewer/RelatedClips';

// Import hooks
import {
  useVideoClip,
  useVideoAnnotations,
  useRelatedVideoClips,
  useCreateVideoAnnotation,
  useUpdateVideoAnnotation,
  useDeleteVideoAnnotation,
  useCreateVideoBookmark,
  useIncrementVideoViewCount,
  useIncrementVideoDownloadCount,
} from '@/hooks/useVideo';

import type { VideoAnnotationInsert, VideoRelatedClip, VideoClip } from '@/types/video';

export function ClipViewerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerError] = useState<string | null>(null);

  // Data fetching
  const { data: clip, isLoading: clipLoading, error: clipError } = useVideoClip(id || '');
  const { data: annotations = [] } = useVideoAnnotations(id || '');
  const { data: relatedClips = [] } = useRelatedVideoClips(id || '');

  // Mutations
  const createAnnotation = useCreateVideoAnnotation();
  const updateAnnotation = useUpdateVideoAnnotation();
  const deleteAnnotation = useDeleteVideoAnnotation();
  const createBookmark = useCreateVideoBookmark();
  const incrementViewCount = useIncrementVideoViewCount();
  const incrementDownloadCount = useIncrementVideoDownloadCount();

  // Track view count when clip loads
  useEffect(() => {
    if (clip && !clipLoading) {
      incrementViewCount.mutate(clip.id);
    }
  }, [clip, clipLoading, incrementViewCount]);

  // Event handlers
  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleCreateAnnotation = useCallback((annotation: VideoAnnotationInsert) => {
    if (!id) return;
    createAnnotation.mutate({ clipId: id, annotationData: annotation });
  }, [id, createAnnotation]);

  const handleUpdateAnnotation = useCallback((annotationId: string, updates: Partial<VideoAnnotationInsert>) => {
    updateAnnotation.mutate({ annotationId, updates });
  }, [updateAnnotation]);

  const handleDeleteAnnotation = useCallback((annotationId: string) => {
    deleteAnnotation.mutate(annotationId);
  }, [deleteAnnotation]);

  const handleBookmark = useCallback(() => {
    if (!id) return;
    createBookmark.mutate({
      clipId: id,
      bookmarkData: {
        clip_id: id,
        user_id: '', // This would come from auth context
        notes: '',
        position_seconds: currentTime,
      },
    });
  }, [id, createBookmark, currentTime]);

  const handleDownload = useCallback(() => {
    if (!id) return;
    incrementDownloadCount.mutate(id);
    // In a real app, this would trigger a download
    toast.success('Download started');
  }, [id, incrementDownloadCount]);

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/clip/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  }, [id]);

  const handleReportIssue = useCallback(() => {
    // In a real app, this would open a report form or redirect
    toast.info('Report issue functionality coming soon');
  }, []);

  const handleAddToCourse = useCallback(() => {
    // In a real app, this would open a course selection modal
    toast.info('Add to course functionality coming soon');
  }, []);

  const handleClipSelect = useCallback((clipId: string) => {
    navigate(`/clip/${clipId}`);
  }, [navigate]);

  const handleEditTranscript = useCallback(() => {
    // In a real app, this would update the transcript
    toast.info('Transcript editing functionality coming soon');
  }, []);

  // Loading state
  if (clipLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading video clip...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (clipError || !clip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The video clip you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold truncate">{clip.title}</h1>
              <p className="text-sm text-muted-foreground truncate">
                {clip.machine_model && `${clip.machine_model} • `}
                {Math.floor(clip.duration_seconds / 60)}:{(clip.duration_seconds % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer
              src={clip.hls_playlist_path || clip.mp4_file_path || ''}
              poster={clip.thumbnail_path}
              title={clip.title}
              duration={clip.duration_seconds}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onTimeUpdate={handleTimeUpdate}
              onPlay={handlePlay}
              onPause={handlePause}
              onSeek={handleSeek}
              error={playerError || undefined}
              className="w-full"
            />

            {/* Tabs for Transcript and Annotations */}
            <Tabs defaultValue="transcript" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="annotations">Notes & Comments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transcript" className="mt-4">
                <TranscriptTimestamps
                  transcript={clip.transcript}
                  segments={clip.transcript_segments}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                  onEditTranscript={handleEditTranscript}
                />
              </TabsContent>
              
              <TabsContent value="annotations" className="mt-4">
                <AnnotationsNotes
                  annotations={annotations}
                  currentTime={currentTime}
                  clipId={id || ''}
                  userId={''} // This would come from auth context
                  onSeek={handleSeek}
                  onCreateAnnotation={handleCreateAnnotation}
                  onUpdateAnnotation={handleUpdateAnnotation}
                  onDeleteAnnotation={handleDeleteAnnotation}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Metadata and Actions */}
          <div className="space-y-6">
            {/* Metadata Panel */}
            <ClipMetadataPanel
              clip={clip}
              onBookmark={handleBookmark}
              onDownload={handleDownload}
              onAddToCourse={handleAddToCourse}
              onReportIssue={handleReportIssue}
              onShare={handleShare}
            />

            {/* Actions */}
            <ClipActions
              clipId={clip.id}
              isBookmarked={false} // This would come from user data
              onBookmark={handleBookmark}
              onAddToCourse={handleAddToCourse}
              onDownload={handleDownload}
              onShare={handleShare}
              onReportIssue={handleReportIssue}
            />

            {/* Related Clips */}
            <RelatedClips
              relatedClips={relatedClips as (VideoRelatedClip & { related_clip: VideoClip })[]}
              onClipSelect={handleClipSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
