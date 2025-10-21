/**
 * Video API functions for Winbro Training Reels
 * Handles video upload, processing, and management operations
 */

import { supabase } from '@/lib/supabase';
import type {
  VideoClip,
  VideoClipInsert,
  VideoClipUpdate,
  VideoClipWithDetails,
  VideoClipListResponse,
  VideoClipFilters,
  VideoClipSortOptions,
  VideoUploadResponse,
  VideoProcessingStatusResponse,
  VideoTranscript,
  VideoTranscriptInsert,
  VideoTranscriptSegment,
  VideoTranscriptSegmentInsert,
  VideoAnnotation,
  VideoAnnotationInsert,
  VideoAnnotationUpdate,
  VideoBookmark,
  VideoBookmarkInsert,
  VideoBookmarkUpdate,
  VideoRelatedClip,
  VideoRelatedClipInsert,
  VideoUploadForm,
} from '@/types/video';

// =====================================================
// Video Clip Operations
// =====================================================

/**
 * Get a single video clip by ID with all related data
 */
export async function getVideoClip(clipId: string): Promise<VideoClipWithDetails> {
  const { data, error } = await supabase
    .from('video_clips')
    .select(`
      *,
      transcript:video_transcripts(*),
      transcript_segments:video_transcript_segments(*),
      annotations:video_annotations(*),
      related_clips:video_related_clips(*),
      bookmarks:video_bookmarks(*),
      processing_jobs:video_processing_jobs(*)
    `)
    .eq('id', clipId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch video clip: ${error.message}`);
  }

  return data as VideoClipWithDetails;
}

/**
 * Get a list of video clips with filtering and pagination
 */
export async function getVideoClips(
  filters: VideoClipFilters = {},
  sort: VideoClipSortOptions = { field: 'created_at', direction: 'desc' },
  page: number = 1,
  limit: number = 20
): Promise<VideoClipListResponse> {
  let query = supabase
    .from('video_clips')
    .select('*', { count: 'exact' });

  // Apply filters
  if (filters.machine_model) {
    query = query.eq('machine_model', filters.machine_model);
  }
  if (filters.process_type) {
    query = query.eq('process_type', filters.process_type);
  }
  if (filters.skill_level) {
    query = query.eq('skill_level', filters.skill_level);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.processing_status) {
    query = query.eq('processing_status', filters.processing_status);
  }
  if (filters.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags);
  }
  if (filters.date_from) {
    query = query.gte('created_at', filters.date_from);
  }
  if (filters.date_to) {
    query = query.lte('created_at', filters.date_to);
  }
  if (filters.search_query) {
    query = query.or(`title.ilike.%${filters.search_query}%,description.ilike.%${filters.search_query}%`);
  }

  // Apply sorting
  query = query.order(sort.field, { ascending: sort.direction === 'asc' });

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch video clips: ${error.message}`);
  }

  return {
    clips: data || [],
    total: count || 0,
    page,
    limit,
    has_more: (count || 0) > page * limit,
  };
}

/**
 * Create a new video clip
 */
export async function createVideoClip(clipData: VideoClipInsert): Promise<VideoClip> {
  const { data, error } = await supabase
    .from('video_clips')
    .insert(clipData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create video clip: ${error.message}`);
  }

  return data;
}

/**
 * Update a video clip
 */
export async function updateVideoClip(clipId: string, updates: VideoClipUpdate): Promise<VideoClip> {
  const { data, error } = await supabase
    .from('video_clips')
    .update(updates)
    .eq('id', clipId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update video clip: ${error.message}`);
  }

  return data;
}

/**
 * Delete a video clip
 */
export async function deleteVideoClip(clipId: string): Promise<void> {
  const { error } = await supabase
    .from('video_clips')
    .delete()
    .eq('id', clipId);

  if (error) {
    throw new Error(`Failed to delete video clip: ${error.message}`);
  }
}

// =====================================================
// Video Upload Operations
// =====================================================

/**
 * Initiate video upload process
 */
export async function initiateVideoUpload(
  formData: VideoUploadForm,
  file: File
): Promise<VideoUploadResponse> {
  // Create video clip record
  const clipData: VideoClipInsert = {
    user_id: (await supabase.auth.getUser()).data.user?.id || '',
    title: formData.title,
    description: formData.description,
    duration_seconds: 0, // Will be updated after processing
    original_filename: file.name,
    file_size_bytes: file.size,
    mime_type: file.type,
    machine_model: formData.machine_model,
    process_type: formData.process_type,
    tooling: formData.tooling,
    skill_level: formData.skill_level,
    tags: formData.tags,
    is_public: formData.is_public,
    processing_status: 'pending',
  };

  const clip = await createVideoClip(clipData);

  // Get presigned upload URL (this would be implemented in your backend)
  const uploadUrl = await getPresignedUploadUrl(clip.id, file.name);

  // Create processing job
  const { data: jobData, error: jobError } = await supabase
    .from('video_processing_jobs')
    .insert({
      clip_id: clip.id,
      job_type: 'transcode',
      status: 'queued',
    })
    .select()
    .single();

  if (jobError) {
    throw new Error(`Failed to create processing job: ${jobError.message}`);
  }

  return {
    clip_id: clip.id,
    upload_url: uploadUrl,
    processing_job_id: jobData.id,
    status: 'uploading',
  };
}

/**
 * Get presigned upload URL (placeholder - implement with your storage service)
 */
async function getPresignedUploadUrl(clipId: string, filename: string): Promise<string> {
  // This would typically call your backend API to get a presigned URL
  // For now, return a placeholder
  return `https://storage.example.com/uploads/${clipId}/${filename}`;
}

/**
 * Complete video upload and start processing
 */
export async function completeVideoUpload(clipId: string): Promise<void> {
  const { error } = await supabase
    .from('video_processing_jobs')
    .update({
      status: 'running',
      started_at: new Date().toISOString(),
    })
    .eq('clip_id', clipId)
    .eq('job_type', 'transcode');

  if (error) {
    throw new Error(`Failed to start processing: ${error.message}`);
  }
}

/**
 * Get video processing status
 */
export async function getVideoProcessingStatus(jobId: string): Promise<VideoProcessingStatusResponse> {
  const { data, error } = await supabase
    .from('video_processing_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch processing status: ${error.message}`);
  }

  return {
    job_id: data.id,
    status: data.status,
    progress_percentage: data.progress_percentage,
    estimated_completion: data.estimated_completion,
    error_message: data.error_message,
  };
}

// =====================================================
// Video Transcript Operations
// =====================================================

/**
 * Get video transcript
 */
export async function getVideoTranscript(clipId: string): Promise<VideoTranscript | null> {
  const { data, error } = await supabase
    .from('video_transcripts')
    .select('*')
    .eq('clip_id', clipId)
    .single();

  if (error && error.code !== 'PGRST116') { // Not found error
    throw new Error(`Failed to fetch transcript: ${error.message}`);
  }

  return data;
}

/**
 * Create or update video transcript
 */
export async function upsertVideoTranscript(
  clipId: string,
  transcriptData: VideoTranscriptInsert
): Promise<VideoTranscript> {
  const { data, error } = await supabase
    .from('video_transcripts')
    .upsert({
      ...transcriptData,
      clip_id: clipId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to upsert transcript: ${error.message}`);
  }

  return data;
}

/**
 * Get video transcript segments
 */
export async function getVideoTranscriptSegments(transcriptId: string): Promise<VideoTranscriptSegment[]> {
  const { data, error } = await supabase
    .from('video_transcript_segments')
    .select('*')
    .eq('transcript_id', transcriptId)
    .order('start_time');

  if (error) {
    throw new Error(`Failed to fetch transcript segments: ${error.message}`);
  }

  return data || [];
}

/**
 * Create video transcript segments
 */
export async function createVideoTranscriptSegments(
  transcriptId: string,
  segments: VideoTranscriptSegmentInsert[]
): Promise<VideoTranscriptSegment[]> {
  const segmentsWithTranscriptId = segments.map(segment => ({
    ...segment,
    transcript_id: transcriptId,
  }));

  const { data, error } = await supabase
    .from('video_transcript_segments')
    .insert(segmentsWithTranscriptId)
    .select();

  if (error) {
    throw new Error(`Failed to create transcript segments: ${error.message}`);
  }

  return data || [];
}

// =====================================================
// Video Annotation Operations
// =====================================================

/**
 * Get video annotations
 */
export async function getVideoAnnotations(clipId: string): Promise<VideoAnnotation[]> {
  const { data, error } = await supabase
    .from('video_annotations')
    .select('*')
    .eq('clip_id', clipId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch annotations: ${error.message}`);
  }

  return data || [];
}

/**
 * Create video annotation
 */
export async function createVideoAnnotation(
  clipId: string,
  annotationData: VideoAnnotationInsert
): Promise<VideoAnnotation> {
  const { data, error } = await supabase
    .from('video_annotations')
    .insert({
      ...annotationData,
      clip_id: clipId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create annotation: ${error.message}`);
  }

  return data;
}

/**
 * Update video annotation
 */
export async function updateVideoAnnotation(
  annotationId: string,
  updates: VideoAnnotationUpdate
): Promise<VideoAnnotation> {
  const { data, error } = await supabase
    .from('video_annotations')
    .update(updates)
    .eq('id', annotationId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update annotation: ${error.message}`);
  }

  return data;
}

/**
 * Delete video annotation
 */
export async function deleteVideoAnnotation(annotationId: string): Promise<void> {
  const { error } = await supabase
    .from('video_annotations')
    .delete()
    .eq('id', annotationId);

  if (error) {
    throw new Error(`Failed to delete annotation: ${error.message}`);
  }
}

// =====================================================
// Video Bookmark Operations
// =====================================================

/**
 * Get user's bookmarks for a video clip
 */
export async function getVideoBookmarks(clipId: string): Promise<VideoBookmark[]> {
  const { data, error } = await supabase
    .from('video_bookmarks')
    .select('*')
    .eq('clip_id', clipId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch bookmarks: ${error.message}`);
  }

  return data || [];
}

/**
 * Create video bookmark
 */
export async function createVideoBookmark(
  clipId: string,
  bookmarkData: VideoBookmarkInsert
): Promise<VideoBookmark> {
  const { data, error } = await supabase
    .from('video_bookmarks')
    .insert({
      ...bookmarkData,
      clip_id: clipId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create bookmark: ${error.message}`);
  }

  return data;
}

/**
 * Update video bookmark
 */
export async function updateVideoBookmark(
  bookmarkId: string,
  updates: VideoBookmarkUpdate
): Promise<VideoBookmark> {
  const { data, error } = await supabase
    .from('video_bookmarks')
    .update(updates)
    .eq('id', bookmarkId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update bookmark: ${error.message}`);
  }

  return data;
}

/**
 * Delete video bookmark
 */
export async function deleteVideoBookmark(bookmarkId: string): Promise<void> {
  const { error } = await supabase
    .from('video_bookmarks')
    .delete()
    .eq('id', bookmarkId);

  if (error) {
    throw new Error(`Failed to delete bookmark: ${error.message}`);
  }
}

// =====================================================
// Video Related Clips Operations
// =====================================================

/**
 * Get related video clips
 */
export async function getRelatedVideoClips(clipId: string): Promise<VideoRelatedClip[]> {
  const { data, error } = await supabase
    .from('video_related_clips')
    .select(`
      *,
      related_clip:video_clips!video_related_clips_related_clip_id_fkey(*)
    `)
    .eq('source_clip_id', clipId)
    .order('similarity_score', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch related clips: ${error.message}`);
  }

  return data || [];
}

/**
 * Create related video clip relationship
 */
export async function createRelatedVideoClip(
  sourceClipId: string,
  relatedClipId: string,
  relationshipData: Omit<VideoRelatedClipInsert, 'source_clip_id' | 'related_clip_id'>
): Promise<VideoRelatedClip> {
  const { data, error } = await supabase
    .from('video_related_clips')
    .insert({
      ...relationshipData,
      source_clip_id: sourceClipId,
      related_clip_id: relatedClipId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create related clip: ${error.message}`);
  }

  return data;
}

// =====================================================
// Analytics Operations
// =====================================================

/**
 * Increment video view count
 */
export async function incrementVideoViewCount(clipId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_video_view_count', {
    clip_id: clipId,
  });

  if (error) {
    throw new Error(`Failed to increment view count: ${error.message}`);
  }
}

/**
 * Increment video download count
 */
export async function incrementVideoDownloadCount(clipId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_video_download_count', {
    clip_id: clipId,
  });

  if (error) {
    throw new Error(`Failed to increment download count: ${error.message}`);
  }
}

/**
 * Increment video bookmark count
 */
export async function incrementVideoBookmarkCount(clipId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_video_bookmark_count', {
    clip_id: clipId,
  });

  if (error) {
    throw new Error(`Failed to increment bookmark count: ${error.message}`);
  }
}
