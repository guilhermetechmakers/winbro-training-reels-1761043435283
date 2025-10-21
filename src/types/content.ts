export interface Clip {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  thumbnail_url: string;
  video_url: string;
  hls_url: string;
  machine_model: string;
  process: string;
  tooling: string[];
  tags: string[];
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  author_id: string;
  author_name: string;
  organization_id: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  transcript?: TranscriptSegment[];
  created_at: string;
  updated_at: string;
  published_at?: string;
  view_count: number;
  bookmark_count: number;
}

export interface TranscriptSegment {
  id: string;
  start_time: number;
  end_time: number;
  text: string;
  confidence: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  author_id: string;
  author_name: string;
  organization_id: string;
  modules: CourseModule[];
  settings: CourseSettings;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  published_at?: string;
  enrollment_count: number;
  completion_rate: number;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  nodes: CourseNode[];
}

export interface CourseNode {
  id: string;
  type: 'clip' | 'quiz';
  order: number;
  clip_id?: string;
  quiz?: Quiz;
  is_required: boolean;
}

export interface Quiz {
  id: string;
  question: string;
  type: 'multiple_choice' | 'short_answer';
  options?: QuizOption[];
  correct_answer: string | string[];
  explanation?: string;
  points: number;
}

export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface CourseSettings {
  passing_threshold: number; // percentage
  max_attempts: number;
  allow_retake: boolean;
  certificate_template_id?: string;
  is_public: boolean;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  issued_at: string;
  expires_at?: string;
  verification_url: string;
  qr_code: string;
  pdf_url: string;
  template_id: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  clip_id: string;
  created_at: string;
}

export interface SearchFilters {
  machine_model?: string[];
  process?: string[];
  tags?: string[];
  skill_level?: string[];
  author?: string[];
  date_range?: {
    start: string;
    end: string;
  };
}

export interface SearchResult {
  clips: Clip[];
  total: number;
  page: number;
  limit: number;
  facets: {
    machine_models: { value: string; count: number }[];
    processes: { value: string; count: number }[];
    tags: { value: string; count: number }[];
    skill_levels: { value: string; count: number }[];
    authors: { value: string; count: number }[];
  };
}
