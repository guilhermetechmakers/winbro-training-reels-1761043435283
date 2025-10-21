/**
 * React Query hooks for video operations
 * Provides data fetching, caching, and mutation capabilities for video clips
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  VideoClipInsert,
  VideoClipUpdate,
  VideoClipWithDetails,
  VideoClipFilters,
  VideoClipSortOptions,
  VideoTranscriptInsert,
  VideoTranscriptSegmentInsert,
  VideoAnnotation,
  VideoAnnotationInsert,
  VideoAnnotationUpdate,
  VideoBookmark,
  VideoBookmarkInsert,
  VideoBookmarkUpdate,
  VideoRelatedClipInsert,
  VideoUploadForm,
} from '@/types/video';
import {
  getVideoClip,
  getVideoClips,
  createVideoClip,
  updateVideoClip,
  deleteVideoClip,
  initiateVideoUpload,
  completeVideoUpload,
  getVideoProcessingStatus,
  getVideoTranscript,
  upsertVideoTranscript,
  getVideoTranscriptSegments,
  createVideoTranscriptSegments,
  getVideoAnnotations,
  createVideoAnnotation,
  updateVideoAnnotation,
  deleteVideoAnnotation,
  getVideoBookmarks,
  createVideoBookmark,
  updateVideoBookmark,
  deleteVideoBookmark,
  getRelatedVideoClips,
  createRelatedVideoClip,
  incrementVideoViewCount,
  incrementVideoDownloadCount,
  incrementVideoBookmarkCount,
} from '@/api/video';

// =====================================================
// Query Keys
// =====================================================

export const videoKeys = {
  all: ['videos'] as const,
  lists: () => [...videoKeys.all, 'list'] as const,
  list: (filters: VideoClipFilters, sort: VideoClipSortOptions, page: number, limit: number) =>
    [...videoKeys.lists(), { filters, sort, page, limit }] as const,
  details: () => [...videoKeys.all, 'detail'] as const,
  detail: (id: string) => [...videoKeys.details(), id] as const,
  transcript: (id: string) => [...videoKeys.detail(id), 'transcript'] as const,
  transcriptSegments: (transcriptId: string) => [...videoKeys.all, 'transcript-segments', transcriptId] as const,
  annotations: (id: string) => [...videoKeys.detail(id), 'annotations'] as const,
  bookmarks: (id: string) => [...videoKeys.detail(id), 'bookmarks'] as const,
  related: (id: string) => [...videoKeys.detail(id), 'related'] as const,
  processing: (jobId: string) => [...videoKeys.all, 'processing', jobId] as const,
} as const;

// =====================================================
// Video Clip Hooks
// =====================================================

/**
 * Get a single video clip with all related data
 */
export function useVideoClip(clipId: string) {
  return useQuery({
    queryKey: videoKeys.detail(clipId),
    queryFn: () => getVideoClip(clipId),
    enabled: !!clipId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get a list of video clips with filtering and pagination
 */
export function useVideoClips(
  filters: VideoClipFilters = {},
  sort: VideoClipSortOptions = { field: 'created_at', direction: 'desc' },
  page: number = 1,
  limit: number = 20
) {
  return useQuery({
    queryKey: videoKeys.list(filters, sort, page, limit),
    queryFn: () => getVideoClips(filters, sort, page, limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Create a new video clip
 */
export function useCreateVideoClip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clipData: VideoClipInsert) => createVideoClip(clipData),
    onSuccess: (newClip) => {
      // Invalidate and refetch video lists
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      
      // Add the new clip to the cache
      queryClient.setQueryData(videoKeys.detail(newClip.id), newClip);
      
      toast.success('Video clip created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create video clip: ${error.message}`);
    },
  });
}

/**
 * Update a video clip
 */
export function useUpdateVideoClip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clipId, updates }: { clipId: string; updates: VideoClipUpdate }) =>
      updateVideoClip(clipId, updates),
    onSuccess: (updatedClip) => {
      // Update the cache
      queryClient.setQueryData(videoKeys.detail(updatedClip.id), updatedClip);
      
      // Invalidate lists to ensure they're up to date
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      
      toast.success('Video clip updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update video clip: ${error.message}`);
    },
  });
}

/**
 * Delete a video clip
 */
export function useDeleteVideoClip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clipId: string) => deleteVideoClip(clipId),
    onSuccess: (_, clipId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: videoKeys.detail(clipId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      
      toast.success('Video clip deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete video clip: ${error.message}`);
    },
  });
}

// =====================================================
// Video Upload Hooks
// =====================================================

/**
 * Initiate video upload process
 */
export function useInitiateVideoUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, file }: { formData: VideoUploadForm; file: File }) =>
      initiateVideoUpload(formData, file),
    onSuccess: () => {
      // Invalidate lists to show the new clip
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      
      toast.success('Video upload initiated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to initiate video upload: ${error.message}`);
    },
  });
}

/**
 * Complete video upload and start processing
 */
export function useCompleteVideoUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clipId: string) => completeVideoUpload(clipId),
    onSuccess: (_, clipId) => {
      // Invalidate the specific clip to refresh processing status
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(clipId) });
      
      toast.success('Video upload completed, processing started');
    },
    onError: (error) => {
      toast.error(`Failed to complete video upload: ${error.message}`);
    },
  });
}

/**
 * Get video processing status
 */
export function useVideoProcessingStatus(jobId: string, enabled: boolean = true) {
  const query = useQuery({
    queryKey: videoKeys.processing(jobId),
    queryFn: () => getVideoProcessingStatus(jobId),
    enabled: enabled && !!jobId,
    refetchInterval: (query) => {
      // Stop polling when processing is complete or failed
      if (query.state.data?.status === 'completed' || query.state.data?.status === 'failed' || query.state.data?.status === 'cancelled') {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
  });

  return query;
}

// =====================================================
// Video Transcript Hooks
// =====================================================

/**
 * Get video transcript
 */
export function useVideoTranscript(clipId: string) {
  return useQuery({
    queryKey: videoKeys.transcript(clipId),
    queryFn: () => getVideoTranscript(clipId),
    enabled: !!clipId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Create or update video transcript
 */
export function useUpsertVideoTranscript() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clipId, transcriptData }: { clipId: string; transcriptData: VideoTranscriptInsert }) =>
      upsertVideoTranscript(clipId, transcriptData),
    onSuccess: (updatedTranscript, { clipId }) => {
      // Update the transcript in the clip detail cache
      queryClient.setQueryData(videoKeys.detail(clipId), (oldData: VideoClipWithDetails | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          transcript: updatedTranscript,
        };
      });
      
      // Invalidate the transcript query
      queryClient.invalidateQueries({ queryKey: videoKeys.transcript(clipId) });
      
      toast.success('Transcript updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update transcript: ${error.message}`);
    },
  });
}

/**
 * Get video transcript segments
 */
export function useVideoTranscriptSegments(transcriptId: string) {
  return useQuery({
    queryKey: videoKeys.transcriptSegments(transcriptId),
    queryFn: () => getVideoTranscriptSegments(transcriptId),
    enabled: !!transcriptId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Create video transcript segments
 */
export function useCreateVideoTranscriptSegments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transcriptId, segments }: { transcriptId: string; segments: VideoTranscriptSegmentInsert[] }) =>
      createVideoTranscriptSegments(transcriptId, segments),
    onSuccess: (newSegments, { transcriptId }) => {
      // Update the segments in the cache
      queryClient.setQueryData(videoKeys.transcriptSegments(transcriptId), newSegments);
      
      toast.success('Transcript segments created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create transcript segments: ${error.message}`);
    },
  });
}

// =====================================================
// Video Annotation Hooks
// =====================================================

/**
 * Get video annotations
 */
export function useVideoAnnotations(clipId: string) {
  return useQuery({
    queryKey: videoKeys.annotations(clipId),
    queryFn: () => getVideoAnnotations(clipId),
    enabled: !!clipId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Create video annotation
 */
export function useCreateVideoAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clipId, annotationData }: { clipId: string; annotationData: VideoAnnotationInsert }) =>
      createVideoAnnotation(clipId, annotationData),
    onSuccess: (newAnnotation, { clipId }) => {
      // Add to the annotations cache
      queryClient.setQueryData(videoKeys.annotations(clipId), (oldData: VideoAnnotation[] | undefined) => {
        return [newAnnotation, ...(oldData || [])];
      });
      
      // Update the clip detail cache
      queryClient.setQueryData(videoKeys.detail(clipId), (oldData: VideoClipWithDetails | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          annotations: [newAnnotation, ...(oldData.annotations || [])],
        };
      });
      
      toast.success('Annotation created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create annotation: ${error.message}`);
    },
  });
}

/**
 * Update video annotation
 */
export function useUpdateVideoAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ annotationId, updates }: { annotationId: string; updates: VideoAnnotationUpdate }) =>
      updateVideoAnnotation(annotationId, updates),
    onSuccess: (updatedAnnotation) => {
      // Find which clip this annotation belongs to
      const clipId = updatedAnnotation.clip_id;
      
      // Update the annotations cache
      queryClient.setQueryData(videoKeys.annotations(clipId), (oldData: VideoAnnotation[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(annotation =>
          annotation.id === updatedAnnotation.id ? updatedAnnotation : annotation
        );
      });
      
      // Update the clip detail cache
      queryClient.setQueryData(videoKeys.detail(clipId), (oldData: VideoClipWithDetails | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          annotations: oldData.annotations?.map(annotation =>
            annotation.id === updatedAnnotation.id ? updatedAnnotation : annotation
          ) || [],
        };
      });
      
      toast.success('Annotation updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update annotation: ${error.message}`);
    },
  });
}

/**
 * Delete video annotation
 */
export function useDeleteVideoAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (annotationId: string) => deleteVideoAnnotation(annotationId),
    onSuccess: () => {
      // We need to find which clip this annotation belongs to
      // This is a bit inefficient, but we'll invalidate the annotations queries
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
      
      toast.success('Annotation deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete annotation: ${error.message}`);
    },
  });
}

// =====================================================
// Video Bookmark Hooks
// =====================================================

/**
 * Get video bookmarks
 */
export function useVideoBookmarks(clipId: string) {
  return useQuery({
    queryKey: videoKeys.bookmarks(clipId),
    queryFn: () => getVideoBookmarks(clipId),
    enabled: !!clipId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Create video bookmark
 */
export function useCreateVideoBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clipId, bookmarkData }: { clipId: string; bookmarkData: VideoBookmarkInsert }) =>
      createVideoBookmark(clipId, bookmarkData),
    onSuccess: (newBookmark, { clipId }) => {
      // Add to the bookmarks cache
      queryClient.setQueryData(videoKeys.bookmarks(clipId), (oldData: VideoBookmark[] | undefined) => {
        return [newBookmark, ...(oldData || [])];
      });
      
      // Update the clip detail cache
      queryClient.setQueryData(videoKeys.detail(clipId), (oldData: VideoClipWithDetails | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          bookmarks: [newBookmark, ...(oldData.bookmarks || [])],
        };
      });
      
      toast.success('Bookmark created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create bookmark: ${error.message}`);
    },
  });
}

/**
 * Update video bookmark
 */
export function useUpdateVideoBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookmarkId, updates }: { bookmarkId: string; updates: VideoBookmarkUpdate }) =>
      updateVideoBookmark(bookmarkId, updates),
    onSuccess: (updatedBookmark) => {
      const clipId = updatedBookmark.clip_id;
      
      // Update the bookmarks cache
      queryClient.setQueryData(videoKeys.bookmarks(clipId), (oldData: VideoBookmark[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(bookmark =>
          bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
        );
      });
      
      toast.success('Bookmark updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update bookmark: ${error.message}`);
    },
  });
}

/**
 * Delete video bookmark
 */
export function useDeleteVideoBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookmarkId: string) => deleteVideoBookmark(bookmarkId),
    onSuccess: () => {
      // Invalidate bookmark queries
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
      
      toast.success('Bookmark deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete bookmark: ${error.message}`);
    },
  });
}

// =====================================================
// Video Related Clips Hooks
// =====================================================

/**
 * Get related video clips
 */
export function useRelatedVideoClips(clipId: string) {
  return useQuery({
    queryKey: videoKeys.related(clipId),
    queryFn: () => getRelatedVideoClips(clipId),
    enabled: !!clipId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Create related video clip relationship
 */
export function useCreateRelatedVideoClip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sourceClipId, relatedClipId, relationshipData }: {
      sourceClipId: string;
      relatedClipId: string;
      relationshipData: Omit<VideoRelatedClipInsert, 'source_clip_id' | 'related_clip_id'>;
    }) => createRelatedVideoClip(sourceClipId, relatedClipId, relationshipData),
    onSuccess: (_, { sourceClipId }) => {
      // Invalidate the related clips query
      queryClient.invalidateQueries({ queryKey: videoKeys.related(sourceClipId) });
      
      toast.success('Related clip added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add related clip: ${error.message}`);
    },
  });
}

// =====================================================
// Analytics Hooks
// =====================================================

/**
 * Increment video view count
 */
export function useIncrementVideoViewCount() {
  return useMutation({
    mutationFn: (clipId: string) => incrementVideoViewCount(clipId),
    onError: (error) => {
      console.error('Failed to increment view count:', error);
    },
  });
}

/**
 * Increment video download count
 */
export function useIncrementVideoDownloadCount() {
  return useMutation({
    mutationFn: (clipId: string) => incrementVideoDownloadCount(clipId),
    onSuccess: () => {
      toast.success('Download recorded');
    },
    onError: (error) => {
      toast.error(`Failed to record download: ${error.message}`);
    },
  });
}

/**
 * Increment video bookmark count
 */
export function useIncrementVideoBookmarkCount() {
  return useMutation({
    mutationFn: (clipId: string) => incrementVideoBookmarkCount(clipId),
    onError: (error) => {
      console.error('Failed to increment bookmark count:', error);
    },
  });
}
