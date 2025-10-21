-- =====================================================
-- Migration: Create Video Clips and Processing Tables
-- Created: 2024-12-13T12:00:00Z
-- Tables: video_clips, video_processing_jobs, video_transcripts, video_annotations, video_related_clips
-- Purpose: Enable video upload, processing, and viewing functionality
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function for updated_at (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLE: video_clips
-- Purpose: Store video clip metadata and processing status
-- =====================================================
CREATE TABLE IF NOT EXISTS video_clips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Core video metadata
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0 AND duration_seconds <= 30),
  
  -- Machine and process information
  machine_model TEXT,
  process_type TEXT,
  tooling TEXT,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  
  -- File information
  original_filename TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  
  -- Processing status
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  processing_error TEXT,
  
  -- Storage paths
  original_file_path TEXT,
  hls_playlist_path TEXT,
  mp4_file_path TEXT,
  thumbnail_path TEXT,
  
  -- Video quality settings
  resolution_width INTEGER,
  resolution_height INTEGER,
  bitrate_kbps INTEGER,
  
  -- Publishing and visibility
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  is_public BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  
  -- Tags and categorization
  tags TEXT[] DEFAULT '{}',
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT video_clips_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT video_clips_duration_valid CHECK (duration_seconds BETWEEN 1 AND 30),
  CONSTRAINT video_clips_file_size_positive CHECK (file_size_bytes > 0)
);

-- =====================================================
-- TABLE: video_processing_jobs
-- Purpose: Track video processing pipeline jobs
-- =====================================================
CREATE TABLE IF NOT EXISTS video_processing_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clip_id UUID REFERENCES video_clips(id) ON DELETE CASCADE NOT NULL,
  
  -- Job information
  job_type TEXT NOT NULL CHECK (job_type IN ('transcode', 'thumbnail', 'transcription', 'hls_generation')),
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  
  -- Processing details
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  error_message TEXT,
  
  -- Job metadata
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  estimated_completion TIMESTAMPTZ,
  
  -- External job references
  external_job_id TEXT,
  processing_service TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- TABLE: video_transcripts
-- Purpose: Store video transcripts with timestamps
-- =====================================================
CREATE TABLE IF NOT EXISTS video_transcripts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clip_id UUID REFERENCES video_clips(id) ON DELETE CASCADE NOT NULL,
  
  -- Transcript content
  content TEXT NOT NULL,
  language_code TEXT DEFAULT 'en-US',
  
  -- Confidence and quality
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  is_auto_generated BOOLEAN DEFAULT true,
  is_edited BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- TABLE: video_transcript_segments
-- Purpose: Store individual transcript segments with precise timestamps
-- =====================================================
CREATE TABLE IF NOT EXISTS video_transcript_segments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transcript_id UUID REFERENCES video_transcripts(id) ON DELETE CASCADE NOT NULL,
  
  -- Segment content
  text TEXT NOT NULL,
  start_time DECIMAL(10,3) NOT NULL CHECK (start_time >= 0),
  end_time DECIMAL(10,3) NOT NULL CHECK (end_time > start_time),
  
  -- Confidence and speaker info
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  speaker_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- TABLE: video_annotations
-- Purpose: Store user annotations and notes for video clips
-- =====================================================
CREATE TABLE IF NOT EXISTS video_annotations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clip_id UUID REFERENCES video_clips(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Annotation content
  content TEXT NOT NULL,
  annotation_type TEXT DEFAULT 'note' CHECK (annotation_type IN ('note', 'comment', 'question', 'highlight')),
  
  -- Time-based annotation
  start_time DECIMAL(10,3),
  end_time DECIMAL(10,3),
  
  -- Visibility and sharing
  is_private BOOLEAN DEFAULT true,
  is_shared_with_team BOOLEAN DEFAULT false,
  
  -- Mentions and replies
  mentions_user_ids UUID[] DEFAULT '{}',
  parent_annotation_id UUID REFERENCES video_annotations(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT video_annotations_content_not_empty CHECK (length(trim(content)) > 0),
  CONSTRAINT video_annotations_time_valid CHECK (
    (start_time IS NULL AND end_time IS NULL) OR 
    (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time)
  )
);

-- =====================================================
-- TABLE: video_related_clips
-- Purpose: Store relationships between video clips
-- =====================================================
CREATE TABLE IF NOT EXISTS video_related_clips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source_clip_id UUID REFERENCES video_clips(id) ON DELETE CASCADE NOT NULL,
  related_clip_id UUID REFERENCES video_clips(id) ON DELETE CASCADE NOT NULL,
  
  -- Relationship details
  relationship_type TEXT DEFAULT 'related' CHECK (relationship_type IN ('related', 'prerequisite', 'follow_up', 'alternative')),
  similarity_score DECIMAL(3,2) CHECK (similarity_score >= 0 AND similarity_score <= 1),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT video_related_clips_no_self_reference CHECK (source_clip_id != related_clip_id),
  CONSTRAINT video_related_clips_unique_relationship UNIQUE (source_clip_id, related_clip_id)
);

-- =====================================================
-- TABLE: video_bookmarks
-- Purpose: Store user bookmarks for video clips
-- =====================================================
CREATE TABLE IF NOT EXISTS video_bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clip_id UUID REFERENCES video_clips(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Bookmark details
  notes TEXT,
  position_seconds DECIMAL(10,3),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT video_bookmarks_unique_user_clip UNIQUE (user_id, clip_id)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS video_clips_user_id_idx ON video_clips(user_id);
CREATE INDEX IF NOT EXISTS video_clips_organization_id_idx ON video_clips(organization_id);
CREATE INDEX IF NOT EXISTS video_clips_status_idx ON video_clips(status);
CREATE INDEX IF NOT EXISTS video_clips_processing_status_idx ON video_clips(processing_status);
CREATE INDEX IF NOT EXISTS video_clips_machine_model_idx ON video_clips(machine_model);
CREATE INDEX IF NOT EXISTS video_clips_process_type_idx ON video_clips(process_type);
CREATE INDEX IF NOT EXISTS video_clips_tags_idx ON video_clips USING GIN(tags);
CREATE INDEX IF NOT EXISTS video_clips_created_at_idx ON video_clips(created_at DESC);
CREATE INDEX IF NOT EXISTS video_clips_published_at_idx ON video_clips(published_at DESC) WHERE published_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS video_processing_jobs_clip_id_idx ON video_processing_jobs(clip_id);
CREATE INDEX IF NOT EXISTS video_processing_jobs_status_idx ON video_processing_jobs(status);
CREATE INDEX IF NOT EXISTS video_processing_jobs_type_idx ON video_processing_jobs(job_type);

CREATE INDEX IF NOT EXISTS video_transcripts_clip_id_idx ON video_transcripts(clip_id);
CREATE INDEX IF NOT EXISTS video_transcript_segments_transcript_id_idx ON video_transcript_segments(transcript_id);
CREATE INDEX IF NOT EXISTS video_transcript_segments_time_idx ON video_transcript_segments(start_time, end_time);

CREATE INDEX IF NOT EXISTS video_annotations_clip_id_idx ON video_annotations(clip_id);
CREATE INDEX IF NOT EXISTS video_annotations_user_id_idx ON video_annotations(user_id);
CREATE INDEX IF NOT EXISTS video_annotations_type_idx ON video_annotations(annotation_type);
CREATE INDEX IF NOT EXISTS video_annotations_time_idx ON video_annotations(start_time, end_time) WHERE start_time IS NOT NULL;

CREATE INDEX IF NOT EXISTS video_related_clips_source_idx ON video_related_clips(source_clip_id);
CREATE INDEX IF NOT EXISTS video_related_clips_related_idx ON video_related_clips(related_clip_id);
CREATE INDEX IF NOT EXISTS video_related_clips_type_idx ON video_related_clips(relationship_type);

CREATE INDEX IF NOT EXISTS video_bookmarks_user_id_idx ON video_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS video_bookmarks_clip_id_idx ON video_bookmarks(clip_id);

-- Auto-update triggers
DROP TRIGGER IF EXISTS update_video_clips_updated_at ON video_clips;
CREATE TRIGGER update_video_clips_updated_at
  BEFORE UPDATE ON video_clips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_video_processing_jobs_updated_at ON video_processing_jobs;
CREATE TRIGGER update_video_processing_jobs_updated_at
  BEFORE UPDATE ON video_processing_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_video_transcripts_updated_at ON video_transcripts;
CREATE TRIGGER update_video_transcripts_updated_at
  BEFORE UPDATE ON video_transcripts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_video_transcript_segments_updated_at ON video_transcript_segments;
CREATE TRIGGER update_video_transcript_segments_updated_at
  BEFORE UPDATE ON video_transcript_segments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_video_annotations_updated_at ON video_annotations;
CREATE TRIGGER update_video_annotations_updated_at
  BEFORE UPDATE ON video_annotations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_video_bookmarks_updated_at ON video_bookmarks;
CREATE TRIGGER update_video_bookmarks_updated_at
  BEFORE UPDATE ON video_bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE video_clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_transcript_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_related_clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_clips
CREATE POLICY "video_clips_select_own_org"
  ON video_clips FOR SELECT
  USING (
    auth.uid() = user_id OR 
    (organization_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.organization_id = video_clips.organization_id
    ))
  );

CREATE POLICY "video_clips_insert_own"
  ON video_clips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "video_clips_update_own"
  ON video_clips FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "video_clips_delete_own"
  ON video_clips FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for video_processing_jobs
CREATE POLICY "video_processing_jobs_select_own_clip"
  ON video_processing_jobs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM video_clips 
    WHERE video_clips.id = video_processing_jobs.clip_id 
    AND (auth.uid() = video_clips.user_id OR 
         (video_clips.organization_id IS NOT NULL AND EXISTS (
           SELECT 1 FROM users 
           WHERE users.id = auth.uid() 
           AND users.organization_id = video_clips.organization_id
         )))
  ));

-- RLS Policies for video_transcripts
CREATE POLICY "video_transcripts_select_own_clip"
  ON video_transcripts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM video_clips 
    WHERE video_clips.id = video_transcripts.clip_id 
    AND (auth.uid() = video_clips.user_id OR 
         (video_clips.organization_id IS NOT NULL AND EXISTS (
           SELECT 1 FROM users 
           WHERE users.id = auth.uid() 
           AND users.organization_id = video_clips.organization_id
         )))
  ));

-- RLS Policies for video_transcript_segments
CREATE POLICY "video_transcript_segments_select_own_transcript"
  ON video_transcript_segments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM video_transcripts 
    JOIN video_clips ON video_clips.id = video_transcripts.clip_id
    WHERE video_transcripts.id = video_transcript_segments.transcript_id 
    AND (auth.uid() = video_clips.user_id OR 
         (video_clips.organization_id IS NOT NULL AND EXISTS (
           SELECT 1 FROM users 
           WHERE users.id = auth.uid() 
           AND users.organization_id = video_clips.organization_id
         )))
  ));

-- RLS Policies for video_annotations
CREATE POLICY "video_annotations_select_own_clip"
  ON video_annotations FOR SELECT
  USING (
    auth.uid() = user_id OR 
    (is_shared_with_team = true AND EXISTS (
      SELECT 1 FROM video_clips 
      WHERE video_clips.id = video_annotations.clip_id 
      AND (auth.uid() = video_clips.user_id OR 
           (video_clips.organization_id IS NOT NULL AND EXISTS (
             SELECT 1 FROM users 
             WHERE users.id = auth.uid() 
             AND users.organization_id = video_clips.organization_id
           )))
    ))
  );

CREATE POLICY "video_annotations_insert_own"
  ON video_annotations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "video_annotations_update_own"
  ON video_annotations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "video_annotations_delete_own"
  ON video_annotations FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for video_related_clips
CREATE POLICY "video_related_clips_select_own_clips"
  ON video_related_clips FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM video_clips 
    WHERE video_clips.id = video_related_clips.source_clip_id 
    AND (auth.uid() = video_clips.user_id OR 
         (video_clips.organization_id IS NOT NULL AND EXISTS (
           SELECT 1 FROM users 
           WHERE users.id = auth.uid() 
           AND users.organization_id = video_clips.organization_id
         )))
  ));

-- RLS Policies for video_bookmarks
CREATE POLICY "video_bookmarks_select_own"
  ON video_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "video_bookmarks_insert_own"
  ON video_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "video_bookmarks_update_own"
  ON video_bookmarks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "video_bookmarks_delete_own"
  ON video_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE video_clips IS 'Core video clips table storing metadata and processing status';
COMMENT ON TABLE video_processing_jobs IS 'Tracks video processing pipeline jobs (transcoding, thumbnails, etc.)';
COMMENT ON TABLE video_transcripts IS 'Stores video transcripts with confidence scores';
COMMENT ON TABLE video_transcript_segments IS 'Individual transcript segments with precise timestamps';
COMMENT ON TABLE video_annotations IS 'User annotations and notes for video clips';
COMMENT ON TABLE video_related_clips IS 'Relationships between video clips for recommendations';
COMMENT ON TABLE video_bookmarks IS 'User bookmarks for video clips';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS video_bookmarks CASCADE;
-- DROP TABLE IF EXISTS video_related_clips CASCADE;
-- DROP TABLE IF EXISTS video_annotations CASCADE;
-- DROP TABLE IF EXISTS video_transcript_segments CASCADE;
-- DROP TABLE IF EXISTS video_transcripts CASCADE;
-- DROP TABLE IF EXISTS video_processing_jobs CASCADE;
-- DROP TABLE IF EXISTS video_clips CASCADE;
