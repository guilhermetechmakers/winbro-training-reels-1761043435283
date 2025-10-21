/**
 * ClipMetadataPanel Component
 * Displays video clip metadata including title, machine model, process, tooling, author, publish date, and tags
 */

import React from 'react';
import { Calendar, User, Tag, Wrench, Cpu, Clock, Eye, Download, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { VideoClip } from '@/types/video';

interface ClipMetadataPanelProps {
  clip: VideoClip;
  onBookmark?: () => void;
  onDownload?: () => void;
  onAddToCourse?: () => void;
  onReportIssue?: () => void;
  onShare?: () => void;
  className?: string;
}

const ClipMetadataPanel: React.FC<ClipMetadataPanelProps> = ({
  clip,
  onBookmark,
  onDownload,
  onAddToCourse,
  onReportIssue,
  onShare,
  className,
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSkillLevelColor = (level: string): string => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
              {clip.title}
            </CardTitle>
            {clip.description && (
              <p className="text-muted-foreground text-sm line-clamp-3">
                {clip.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge 
              variant="outline" 
              className={cn("text-xs", getStatusColor(clip.status))}
            >
              {clip.status}
            </Badge>
            {clip.skill_level && (
              <Badge 
                variant="outline" 
                className={cn("text-xs", getSkillLevelColor(clip.skill_level))}
              >
                {clip.skill_level}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Machine and Process Information */}
        {(clip.machine_model || clip.process_type || clip.tooling) && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Machine & Process Details
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {clip.machine_model && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground">Machine Model</div>
                    <div className="text-sm font-medium text-foreground">{clip.machine_model}</div>
                  </div>
                </div>
              )}
              {clip.process_type && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground">Process Type</div>
                    <div className="text-sm font-medium text-foreground">{clip.process_type}</div>
                  </div>
                </div>
              )}
              {clip.tooling && (
                <div className="flex items-center gap-3">
                  <Wrench className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground">Tooling</div>
                    <div className="text-sm font-medium text-foreground">{clip.tooling}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Video Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Video Information
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="text-sm font-medium text-foreground">
                {formatDuration(clip.duration_seconds)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">File Size</div>
              <div className="text-sm font-medium text-foreground">
                {(clip.file_size_bytes / (1024 * 1024)).toFixed(1)} MB
              </div>
            </div>
            {clip.resolution_width && clip.resolution_height && (
              <div>
                <div className="text-xs text-muted-foreground">Resolution</div>
                <div className="text-sm font-medium text-foreground">
                  {clip.resolution_width} × {clip.resolution_height}
                </div>
              </div>
            )}
            {clip.bitrate_kbps && (
              <div>
                <div className="text-xs text-muted-foreground">Bitrate</div>
                <div className="text-sm font-medium text-foreground">
                  {clip.bitrate_kbps} kbps
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Tags */}
        {clip.tags && clip.tags.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {clip.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs px-2 py-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Author and Publishing Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <User className="h-4 w-4" />
            Author & Publishing
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Created</div>
                <div className="text-sm font-medium text-foreground">
                  {formatDate(clip.created_at)}
                </div>
              </div>
            </div>
            {clip.published_at && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Published</div>
                  <div className="text-sm font-medium text-foreground">
                    {formatDate(clip.published_at)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Analytics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Analytics
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{clip.view_count}</div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{clip.download_count}</div>
              <div className="text-xs text-muted-foreground">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{clip.bookmark_count}</div>
              <div className="text-xs text-muted-foreground">Bookmarks</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBookmark}
              className="flex items-center gap-2"
            >
              <Bookmark className="h-4 w-4" />
              Bookmark
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddToCourse}
              className="flex items-center gap-2"
            >
              <Tag className="h-4 w-4" />
              Add to Course
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Share
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onReportIssue}
            className="w-full flex items-center gap-2 text-destructive hover:text-destructive"
          >
            <Wrench className="h-4 w-4" />
            Report Issue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClipMetadataPanel;
