/**
 * RelatedClips Component
 * Displays related video clips with suggestions based on machine/process similarity
 */

import React from 'react';
import { Play, Clock, Eye, Tag, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { VideoClip, VideoRelatedClip } from '@/types/video';

interface RelatedClipsProps {
  relatedClips: (VideoRelatedClip & { related_clip: VideoClip })[];
  onClipSelect: (clipId: string) => void;
  className?: string;
}

const RelatedClips: React.FC<RelatedClipsProps> = ({
  relatedClips,
  onClipSelect,
  className,
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRelationshipTypeColor = (type: string): string => {
    switch (type) {
      case 'prerequisite':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'follow_up':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'alternative':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRelationshipTypeLabel = (type: string): string => {
    switch (type) {
      case 'prerequisite':
        return 'Prerequisite';
      case 'follow_up':
        return 'Follow-up';
      case 'alternative':
        return 'Alternative';
      default:
        return 'Related';
    }
  };

  if (relatedClips.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Related Clips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ArrowRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No related clips found.</p>
            <p className="text-sm">Related clips will appear here based on machine model and process type.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Related Clips
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {relatedClips.map((relatedClip) => {
            const clip = relatedClip.related_clip;
            return (
              <div
                key={relatedClip.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => onClipSelect(clip.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {clip.thumbnail_path ? (
                        <img
                          src={clip.thumbnail_path}
                          alt={clip.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Play className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                      {formatDuration(clip.duration_seconds)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {clip.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={cn("text-xs ml-2", getRelationshipTypeColor(relatedClip.relationship_type))}
                      >
                        {getRelationshipTypeLabel(relatedClip.relationship_type)}
                      </Badge>
                    </div>

                    {clip.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {clip.description}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(clip.duration_seconds)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{clip.view_count} views</span>
                      </div>
                      {clip.machine_model && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <span>{clip.machine_model}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {clip.tags && clip.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {clip.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs px-1 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {clip.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            +{clip.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Similarity Score */}
                    {relatedClip.similarity_score && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-muted-foreground">Similarity</div>
                          <div className="flex-1 bg-muted rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${relatedClip.similarity_score * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(relatedClip.similarity_score * 100)}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Play Button */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClipSelect(clip.id);
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {relatedClips.length} related clip{relatedClips.length !== 1 ? 's' : ''}
            </span>
            <Button variant="ghost" size="sm" className="text-xs h-6">
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedClips;
