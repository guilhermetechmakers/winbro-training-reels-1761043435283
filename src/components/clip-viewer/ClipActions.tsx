/**
 * ClipActions Component
 * Provides action buttons for bookmarking, adding to course, reporting issues, sharing, and downloading
 */

import React, { useState } from 'react';
import { Bookmark, Plus, Download, Share2, Flag, Check, Heart, MessageSquare, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ClipActionsProps {
  clipId: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
  onBookmark?: () => void;
  onAddToCourse?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onReportIssue?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  className?: string;
}

const ClipActions: React.FC<ClipActionsProps> = ({
  clipId,
  isBookmarked = false,
  isLiked = false,
  onBookmark,
  onAddToCourse,
  onDownload,
  onShare,
  onReportIssue,
  onLike,
  onComment,
  className,
}) => {
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleBookmark = async () => {
    if (isBookmarking) return;
    setIsBookmarking(true);
    try {
      await onBookmark?.();
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await onLike?.();
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      await onShare?.();
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/clip/${clipId}`;
    navigator.clipboard.writeText(url);
  };

  const handleDownload = () => {
    onDownload?.();
  };

  const handleReportIssue = () => {
    onReportIssue?.();
  };

  const handleAddToCourse = () => {
    onAddToCourse?.();
  };

  const handleComment = () => {
    onComment?.();
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={handleBookmark}
              disabled={isBookmarking}
              className="flex items-center gap-2"
            >
              {isBookmarking ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              ) : isBookmarked ? (
                <Check className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToCourse}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add to Course
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center gap-2"
            >
              {isLiking ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              ) : (
                <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
              )}
              Like
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleComment}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Comment
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center gap-2"
            >
              {isSharing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              Share
            </Button>
          </div>

          {/* Utility Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="w-full flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="w-full flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Copy Link
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReportIssue}
              className="w-full flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <Flag className="h-4 w-4" />
              Report Issue
            </Button>
          </div>

          {/* Status Indicators */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Status</span>
              <div className="flex items-center gap-2">
                {isBookmarked && (
                  <Badge variant="secondary" className="text-xs">
                    <Bookmark className="h-3 w-3 mr-1" />
                    Bookmarked
                  </Badge>
                )}
                {isLiked && (
                  <Badge variant="secondary" className="text-xs">
                    <Heart className="h-3 w-3 mr-1 fill-red-500 text-red-500" />
                    Liked
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClipActions;
