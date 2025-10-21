/**
 * Video-related types for Winbro Training Reels
 * Generated: 2024-12-13T12:00:00Z
 */

// =====================================================
// Core Video Clip Types
// =====================================================

export interface VideoClip {
  id: string;
  user_id: string;
  organization_id?: string;
  
  // Core video metadata
  title: string;
  description?: string;
  duration_seconds: number;
  
  // Machine and process information
  machine_model?: string;
  process_type?: string;
  tooling?: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  
  // File information
  original_filename: string;
  file_size_bytes: number;
  mime_type: string;
  
  // Processing status
  processing_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  processing_error?: string;
  
  // Storage paths
  original_file_path?: string;
  hls_playlist_path?: string;
  mp4_file_path?: string;
  thumbnail_path?: string;
  
  // Video quality settings
  resolution_width?: number;
  resolution_height?: number;
  bitrate_kbps?: number;
  
  // Publishing and visibility
  status: 'draft' | 'review' | 'published' | 'archived';
  is_public: boolean;
  published_at?: string;
  
  // Tags and categorization
  tags: string[];
  
  // Analytics
  view_count: number;
  download_count: number;
  bookmark_count: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface VideoClipInsert {
  id?: string;
  user_id: string;
  organization_id?: string;
  title: string;
  description?: string;
  duration_seconds: number;
  machine_model?: string;
  process_type?: string;
  tooling?: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  original_filename: string;
  file_size_bytes: number;
  mime_type: string;
  processing_status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  processing_error?: string;
  original_file_path?: string;
  hls_playlist_path?: string;
  mp4_file_path?: string;
  thumbnail_path?: string;
  resolution_width?: number;
  resolution_height?: number;
  bitrate_kbps?: number;
  status?: 'draft' | 'review' | 'published' | 'archived';
  is_public?: boolean;
  published_at?: string;
  tags?: string[];
  view_count?: number;
  download_count?: number;
  bookmark_count?: number;
}

export interface VideoClipUpdate {
  title?: string;
  description?: string;
  duration_seconds?: number;
  machine_model?: string;
  process_type?: string;
  tooling?: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  processing_status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  processing_error?: string;
  original_file_path?: string;
  hls_playlist_path?: string;
  mp4_file_path?: string;
  thumbnail_path?: string;
  resolution_width?: number;
  resolution_height?: number;
  bitrate_kbps?: number;
  status?: 'draft' | 'review' | 'published' | 'archived';
  is_public?: boolean;
  published_at?: string;
  tags?: string[];
  view_count?: number;
  download_count?: number;
  bookmark_count?: number;
}

// =====================================================
// Video Processing Job Types
// =====================================================

export interface VideoProcessingJob {
  id: string;
  clip_id: string;
  job_type: 'transcode' | 'thumbnail' | 'transcription' | 'hls_generation';
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress_percentage: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  estimated_completion?: string;
  external_job_id?: string;
  processing_service?: string;
  created_at: string;
  updated_at: string;
}

export interface VideoProcessingJobInsert {
  id?: string;
  clip_id: string;
  job_type: 'transcode' | 'thumbnail' | 'transcription' | 'hls_generation';
  status?: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress_percentage?: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  estimated_completion?: string;
  external_job_id?: string;
  processing_service?: string;
}

export interface VideoProcessingJobUpdate {
  status?: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress_percentage?: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  estimated_completion?: string;
  external_job_id?: string;
  processing_service?: string;
}

// =====================================================
// Video Transcript Types
// =====================================================

export interface VideoTranscript {
  id: string;
  clip_id: string;
  content: string;
  language_code: string;
  confidence_score?: number;
  is_auto_generated: boolean;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface VideoTranscriptInsert {
  id?: string;
  clip_id: string;
  content: string;
  language_code?: string;
  confidence_score?: number;
  is_auto_generated?: boolean;
  is_edited?: boolean;
}

export interface VideoTranscriptUpdate {
  content?: string;
  language_code?: string;
  confidence_score?: number;
  is_auto_generated?: boolean;
  is_edited?: boolean;
}

// =====================================================
// Video Transcript Segment Types
// =====================================================

export interface VideoTranscriptSegment {
  id: string;
  transcript_id: string;
  text: string;
  start_time: number;
  end_time: number;
  confidence?: number;
  speaker_id?: string;
  created_at: string;
  updated_at: string;
}

export interface VideoTranscriptSegmentInsert {
  id?: string;
  transcript_id: string;
  text: string;
  start_time: number;
  end_time: number;
  confidence?: number;
  speaker_id?: string;
}

export interface VideoTranscriptSegmentUpdate {
  text?: string;
  start_time?: number;
  end_time?: number;
  confidence?: number;
  speaker_id?: string;
}

// =====================================================
// Video Annotation Types
// =====================================================

export interface VideoAnnotation {
  id: string;
  clip_id: string;
  user_id: string;
  content: string;
  annotation_type: 'note' | 'comment' | 'question' | 'highlight';
  start_time?: number;
  end_time?: number;
  is_private: boolean;
  is_shared_with_team: boolean;
  mentions_user_ids: string[];
  parent_annotation_id?: string;
  created_at: string;
  updated_at: string;
}

export interface VideoAnnotationInsert {
  id?: string;
  clip_id: string;
  user_id: string;
  content: string;
  annotation_type?: 'note' | 'comment' | 'question' | 'highlight';
  start_time?: number;
  end_time?: number;
  is_private?: boolean;
  is_shared_with_team?: boolean;
  mentions_user_ids?: string[];
  parent_annotation_id?: string;
}

export interface VideoAnnotationUpdate {
  content?: string;
  annotation_type?: 'note' | 'comment' | 'question' | 'highlight';
  start_time?: number;
  end_time?: number;
  is_private?: boolean;
  is_shared_with_team?: boolean;
  mentions_user_ids?: string[];
  parent_annotation_id?: string;
}

// =====================================================
// Video Related Clips Types
// =====================================================

export interface VideoRelatedClip {
  id: string;
  source_clip_id: string;
  related_clip_id: string;
  relationship_type: 'related' | 'prerequisite' | 'follow_up' | 'alternative';
  similarity_score?: number;
  created_at: string;
}

export interface VideoRelatedClipInsert {
  id?: string;
  source_clip_id: string;
  related_clip_id: string;
  relationship_type?: 'related' | 'prerequisite' | 'follow_up' | 'alternative';
  similarity_score?: number;
}

// =====================================================
// Video Bookmark Types
// =====================================================

export interface VideoBookmark {
  id: string;
  clip_id: string;
  user_id: string;
  notes?: string;
  position_seconds?: number;
  created_at: string;
  updated_at: string;
}

export interface VideoBookmarkInsert {
  id?: string;
  clip_id: string;
  user_id: string;
  notes?: string;
  position_seconds?: number;
}

export interface VideoBookmarkUpdate {
  notes?: string;
  position_seconds?: number;
}

// =====================================================
// Extended Types with Relations
// =====================================================

export interface VideoClipWithDetails extends VideoClip {
  transcript?: VideoTranscript;
  transcript_segments?: VideoTranscriptSegment[];
  annotations?: VideoAnnotation[];
  related_clips?: VideoRelatedClip[];
  bookmarks?: VideoBookmark[];
  processing_jobs?: VideoProcessingJob[];
}

// =====================================================
// API Response Types
// =====================================================

export interface VideoClipListResponse {
  clips: VideoClip[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface VideoUploadResponse {
  clip_id: string;
  upload_url: string;
  processing_job_id: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
}

export interface VideoProcessingStatusResponse {
  job_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress_percentage: number;
  estimated_completion?: string;
  error_message?: string;
}

// =====================================================
// Form Types
// =====================================================

export interface VideoUploadForm {
  title: string;
  description?: string;
  machine_model?: string;
  process_type?: string;
  tooling?: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  is_public: boolean;
}

export interface VideoAnnotationForm {
  content: string;
  annotation_type: 'note' | 'comment' | 'question' | 'highlight';
  start_time?: number;
  end_time?: number;
  is_private: boolean;
  is_shared_with_team: boolean;
  mentions_user_ids: string[];
}

// =====================================================
// Filter and Search Types
// =====================================================

export interface VideoClipFilters {
  machine_model?: string;
  process_type?: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  status?: 'draft' | 'review' | 'published' | 'archived';
  processing_status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  tags?: string[];
  date_from?: string;
  date_to?: string;
  search_query?: string;
}

export interface VideoClipSortOptions {
  field: 'created_at' | 'updated_at' | 'title' | 'duration_seconds' | 'view_count' | 'published_at';
  direction: 'asc' | 'desc';
}

// =====================================================
// Player Types
// =====================================================

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  quality: string;
  isFullscreen: boolean;
  isPictureInPicture: boolean;
  isMuted: boolean;
  isLoading: boolean;
  error?: string;
}

export interface VideoPlayerControls {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setQuality: (quality: string) => void;
  toggleFullscreen: () => void;
  togglePictureInPicture: () => void;
  toggleMute: () => void;
}

// =====================================================
// Export all types
// =====================================================

export type VideoClipRow = VideoClip;
export type VideoProcessingJobRow = VideoProcessingJob;
export type VideoTranscriptRow = VideoTranscript;
export type VideoTranscriptSegmentRow = VideoTranscriptSegment;
export type VideoAnnotationRow = VideoAnnotation;
export type VideoRelatedClipRow = VideoRelatedClip;
export type VideoBookmarkRow = VideoBookmark;
