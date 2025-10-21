/**
 * TranscriptTimestamps Component
 * Displays video transcript with clickable timestamps and auto-synced highlighting
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Clock, Play, Edit3, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { VideoTranscript, VideoTranscriptSegment } from '@/types/video';

interface TranscriptTimestampsProps {
  transcript?: VideoTranscript;
  segments?: VideoTranscriptSegment[];
  currentTime: number;
  onSeek: (time: number) => void;
  onEditTranscript?: (content: string) => void;
  className?: string;
}

const TranscriptTimestamps: React.FC<TranscriptTimestampsProps> = ({
  transcript,
  segments = [],
  currentTime,
  onSeek,
  onEditTranscript,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const segmentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Update active segment based on current time
  useEffect(() => {
    const activeSegment = segments.find(segment => 
      currentTime >= segment.start_time && currentTime <= segment.end_time
    );
    
    if (activeSegment) {
      setActiveSegmentId(activeSegment.id);
      // Scroll to active segment
      const segmentElement = segmentRefs.current[activeSegment.id];
      if (segmentElement) {
        segmentElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    } else {
      setActiveSegmentId(null);
    }
  }, [currentTime, segments]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSegmentClick = useCallback((startTime: number) => {
    onSeek(startTime);
  }, [onSeek]);

  const handleEditStart = useCallback(() => {
    if (transcript) {
      setEditContent(transcript.content);
      setIsEditing(true);
    }
  }, [transcript]);

  const handleEditSave = useCallback(() => {
    if (onEditTranscript && editContent.trim()) {
      onEditTranscript(editContent.trim());
      setIsEditing(false);
    }
  }, [onEditTranscript, editContent]);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditContent('');
  }, []);

  const getConfidenceColor = (confidence?: number): string => {
    if (!confidence) return 'bg-gray-100 text-gray-800';
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceLabel = (confidence?: number): string => {
    if (!confidence) return 'Unknown';
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  if (!transcript && segments.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Transcript
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transcript available for this video.</p>
            <p className="text-sm">Transcripts are generated automatically during video processing.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Transcript
          </CardTitle>
          <div className="flex items-center gap-2">
            {transcript?.is_auto_generated && (
              <Badge variant="outline" className="text-xs">
                Auto-generated
              </Badge>
            )}
            {transcript?.is_edited && (
              <Badge variant="outline" className="text-xs">
                Edited
              </Badge>
            )}
            {transcript?.confidence_score && (
              <Badge 
                variant="outline" 
                className={cn("text-xs", getConfidenceColor(transcript.confidence_score))}
              >
                {getConfidenceLabel(transcript.confidence_score)} Confidence
              </Badge>
            )}
            {onEditTranscript && (
              <Button
                variant="outline"
                size="sm"
                onClick={isEditing ? handleEditSave : handleEditStart}
                className="flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <Check className="h-4 w-4" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
            )}
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditCancel}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Edit transcript content..."
              className="min-h-32"
            />
            <div className="text-xs text-muted-foreground">
              Edit the transcript content. Changes will be saved when you click Save.
            </div>
          </div>
        ) : segments.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {segments.map((segment) => (
              <div
                key={segment.id}
                ref={(el) => (segmentRefs.current[segment.id] = el)}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  activeSegmentId === segment.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50"
                )}
                onClick={() => handleSegmentClick(segment.start_time)}
              >
                <div className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-16 text-xs font-mono"
                  >
                    {formatTime(segment.start_time)}
                  </Button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">
                    {segment.text}
                  </p>
                  {segment.confidence && (
                    <div className="mt-1">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getConfidenceColor(segment.confidence))}
                      >
                        {getConfidenceLabel(segment.confidence)} Confidence
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSegmentClick(segment.start_time);
                    }}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : transcript ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {transcript.content}
              </p>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Full transcript - click timestamps above to jump to specific segments
            </div>
          </div>
        ) : null}

        {/* Search and Filter Controls */}
        {segments.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {segments.length} segments • Click any timestamp to jump to that moment
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptTimestamps;
