/**
 * AnnotationsNotes Component
 * Displays personal notes and team-shared comments with mention support
 */

import React, { useState, useCallback, useRef } from 'react';
import { MessageSquare, Plus, Edit3, Trash2, Lock, Users, Clock, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { VideoAnnotation, VideoAnnotationInsert } from '@/types/video';

interface AnnotationsNotesProps {
  annotations: VideoAnnotation[];
  currentTime: number;
  clipId: string;
  userId: string;
  onSeek: (time: number) => void;
  onCreateAnnotation: (annotation: VideoAnnotationInsert) => void;
  onUpdateAnnotation: (id: string, updates: Partial<VideoAnnotation>) => void;
  onDeleteAnnotation: (id: string) => void;
  className?: string;
}

const AnnotationsNotes: React.FC<AnnotationsNotesProps> = ({
  annotations,
  currentTime,
  clipId,
  userId,
  onSeek,
  onCreateAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  className,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState({
    content: '',
    annotation_type: 'note' as 'note' | 'comment' | 'question' | 'highlight',
    start_time: currentTime,
    end_time: currentTime + 5,
    is_private: true,
    is_shared_with_team: false,
    mentions_user_ids: [] as string[],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAnnotationTypeIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'question':
        return <MessageSquare className="h-4 w-4" />;
      case 'highlight':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getAnnotationTypeColor = (type: string): string => {
    switch (type) {
      case 'note':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'comment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'question':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'highlight':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCreateAnnotation = useCallback(() => {
    if (newAnnotation.content.trim()) {
      onCreateAnnotation({
        clip_id: clipId,
        user_id: userId,
        ...newAnnotation,
        content: newAnnotation.content.trim(),
      });
      setNewAnnotation({
        content: '',
        annotation_type: 'note',
        start_time: currentTime,
        end_time: currentTime + 5,
        is_private: true,
        is_shared_with_team: false,
        mentions_user_ids: [],
      });
      setIsCreating(false);
    }
  }, [newAnnotation, onCreateAnnotation, currentTime]);

  const handleEditStart = useCallback((annotation: VideoAnnotation) => {
    setEditingId(annotation.id);
    setEditingContent(annotation.content);
  }, []);

  const handleEditSave = useCallback(() => {
    if (editingId && editingContent.trim()) {
      onUpdateAnnotation(editingId, { content: editingContent.trim() });
      setEditingId(null);
      setEditingContent('');
    }
  }, [editingId, editingContent, onUpdateAnnotation]);

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
    setEditingContent('');
  }, []);

  const handleDeleteAnnotation = useCallback((id: string) => {
    onDeleteAnnotation(id);
  }, [onDeleteAnnotation]);

  const handleAnnotationClick = useCallback((startTime: number) => {
    onSeek(startTime);
  }, [onSeek]);

  const handleMentionInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewAnnotation(prev => ({ ...prev, content: value }));
    
    // Check for @ mentions
    const mentionMatch = value.match(/@(\w*)$/);
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  }, []);

  const handleMentionSelect = useCallback((userId: string, username: string) => {
    const content = newAnnotation.content.replace(/@\w*$/, `@${username} `);
    setNewAnnotation(prev => ({
      ...prev,
      content,
      mentions_user_ids: [...prev.mentions_user_ids, userId],
    }));
    setShowMentions(false);
    setMentionQuery('');
  }, [newAnnotation.content]);

  // Mock users for mentions (in real app, this would come from props or API)
  const mockUsers = [
    { id: '1', name: 'John Doe', username: 'john.doe' },
    { id: '2', name: 'Jane Smith', username: 'jane.smith' },
    { id: '3', name: 'Mike Johnson', username: 'mike.johnson' },
  ];

  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Notes & Comments
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Note
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Create New Annotation */}
        {isCreating && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {formatTime(newAnnotation.start_time)} - {formatTime(newAnnotation.end_time)}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewAnnotation(prev => ({
                      ...prev,
                      start_time: currentTime,
                      end_time: currentTime + 5,
                    }));
                  }}
                >
                  Set to Current Time
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Start time (seconds)"
                  type="number"
                  value={newAnnotation.start_time}
                  onChange={(e) => setNewAnnotation(prev => ({
                    ...prev,
                    start_time: parseFloat(e.target.value) || 0,
                  }))}
                />
                <Input
                  placeholder="End time (seconds)"
                  type="number"
                  value={newAnnotation.end_time}
                  onChange={(e) => setNewAnnotation(prev => ({
                    ...prev,
                    end_time: parseFloat(e.target.value) || 0,
                  }))}
                />
              </div>

              <Textarea
                ref={textareaRef}
                placeholder="Add your note or comment... Use @username to mention someone"
                value={newAnnotation.content}
                onChange={handleMentionInput}
                className="min-h-20"
              />

              {showMentions && (
                <div className="border rounded-lg bg-background shadow-lg max-h-32 overflow-y-auto">
                  {filteredUsers.map(user => (
                    <button
                      key={user.id}
                      className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2"
                      onClick={() => handleMentionSelect(user.id, user.username)}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">@{user.username}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="note"
                    name="annotation_type"
                    value="note"
                    checked={newAnnotation.annotation_type === 'note'}
                    onChange={(e) => setNewAnnotation(prev => ({
                      ...prev,
                      annotation_type: e.target.value as any,
                    }))}
                  />
                  <label htmlFor="note" className="text-sm">Note</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="comment"
                    name="annotation_type"
                    value="comment"
                    checked={newAnnotation.annotation_type === 'comment'}
                    onChange={(e) => setNewAnnotation(prev => ({
                      ...prev,
                      annotation_type: e.target.value as any,
                    }))}
                  />
                  <label htmlFor="comment" className="text-sm">Comment</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="question"
                    name="annotation_type"
                    value="question"
                    checked={newAnnotation.annotation_type === 'question'}
                    onChange={(e) => setNewAnnotation(prev => ({
                      ...prev,
                      annotation_type: e.target.value as any,
                    }))}
                  />
                  <label htmlFor="question" className="text-sm">Question</label>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="private"
                    checked={newAnnotation.is_private}
                    onChange={(e) => setNewAnnotation(prev => ({
                      ...prev,
                      is_private: e.target.checked,
                    }))}
                  />
                  <label htmlFor="private" className="text-sm flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Private
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="shared"
                    checked={newAnnotation.is_shared_with_team}
                    onChange={(e) => setNewAnnotation(prev => ({
                      ...prev,
                      is_shared_with_team: e.target.checked,
                    }))}
                  />
                  <label htmlFor="shared" className="text-sm flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Share with Team
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleCreateAnnotation} size="sm">
                  Add Note
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Annotations List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {annotations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notes or comments yet.</p>
              <p className="text-sm">Add the first note to start the conversation.</p>
            </div>
          ) : (
            annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      U
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className={cn("text-xs", getAnnotationTypeColor(annotation.annotation_type))}
                      >
                        {getAnnotationTypeIcon(annotation.annotation_type)}
                        <span className="ml-1 capitalize">{annotation.annotation_type}</span>
                      </Badge>
                      
                      <Badge variant="outline" className="text-xs">
                        {formatTime(annotation.start_time || 0)} - {formatTime(annotation.end_time || 0)}
                      </Badge>
                      
                      {annotation.is_private && (
                        <Badge variant="outline" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Private
                        </Badge>
                      )}
                      
                      {annotation.is_shared_with_team && (
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          Team
                        </Badge>
                      )}
                    </div>

                    {editingId === annotation.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="min-h-20"
                        />
                        <div className="flex items-center gap-2">
                          <Button onClick={handleEditSave} size="sm">
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-foreground leading-relaxed">
                          {annotation.content}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(annotation.created_at)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAnnotationClick(annotation.start_time || 0)}
                            className="h-6 px-2 text-xs"
                          >
                            Jump to Time
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStart(annotation)}
                            className="h-6 px-2 text-xs"
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleDeleteAnnotation(annotation.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnotationsNotes;
