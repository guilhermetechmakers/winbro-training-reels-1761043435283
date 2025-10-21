/**
 * UploadContentPage Component
 * Drag-and-drop video upload with metadata form and processing status
 */

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Check, AlertCircle, Video, FileText, Settings, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Import hooks
import { useInitiateVideoUpload } from '@/hooks/useVideo';

// Form validation schema
const uploadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  machine_model: z.string().optional(),
  process_type: z.string().optional(),
  tooling: z.string().optional(),
  skill_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  tags: z.array(z.string()).default([]),
  is_public: z.boolean().default(false),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface UploadedFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  processingJobId?: string;
}

export function UploadContentPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form setup
  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      description: '',
      machine_model: '',
      process_type: '',
      tooling: '',
      skill_level: 'beginner',
      tags: [],
      is_public: false,
    },
  });

  // Mutations
  const initiateUpload = useInitiateVideoUpload();

  // File handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0,
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    toast.success(`${acceptedFiles.length} file(s) added to upload queue`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true,
  });

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const uploadFile = useCallback(async (uploadedFile: UploadedFile) => {
    const formData = form.getValues();
    
    try {
      setUploadedFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, status: 'uploading', progress: 10 }
          : f
      ));

      const result = await initiateUpload.mutateAsync({
        formData,
        file: uploadedFile.file,
      });

      setUploadedFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { 
              ...f, 
              status: 'processing', 
              progress: 50,
              processingJobId: result.processing_job_id 
            }
          : f
      ));

      toast.success('Upload initiated successfully');
    } catch (error) {
      setUploadedFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { 
              ...f, 
              status: 'error', 
              error: error instanceof Error ? error.message : 'Upload failed' 
            }
          : f
      ));
      toast.error('Upload failed');
    }
  }, [form, initiateUpload]);

  const onSubmit = useCallback(() => {
    if (uploadedFiles.length === 0) {
      toast.error('Please select at least one video file');
      return;
    }

    // Start uploading all pending files
    uploadedFiles
      .filter(f => f.status === 'pending')
      .forEach(uploadFile);
  }, [uploadedFiles, uploadFile]);

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'uploading':
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'processing':
        return <Settings className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Upload Content</h1>
            <p className="text-muted-foreground">
              Upload and process training videos with automatic transcription and metadata extraction.
            </p>
          </div>

          {/* Upload Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Video Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                    isDragActive || dragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  )}
                >
                  <input {...getInputProps()} ref={fileInputRef} />
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    {isDragActive ? 'Drop videos here' : 'Drag & drop videos here'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    or click to select files
                  </p>
                  <Button type="button" variant="outline">
                    Choose Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports MP4, MOV, AVI, MKV, WebM up to 100MB each
                  </p>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium">Upload Queue ({uploadedFiles.length})</h4>
                    {uploadedFiles.map((uploadedFile) => (
                      <div
                        key={uploadedFile.id}
                        className="flex items-center gap-4 p-3 border rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          {getStatusIcon(uploadedFile.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium truncate">
                              {uploadedFile.file.name}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn("text-xs", getStatusColor(uploadedFile.status))}
                            >
                              {uploadedFile.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{formatFileSize(uploadedFile.file.size)}</span>
                            <span>
                              {uploadedFile.file.type || 'Unknown format'}
                            </span>
                          </div>
                          {uploadedFile.status === 'uploading' || uploadedFile.status === 'processing' ? (
                            <Progress value={uploadedFile.progress} className="mt-2" />
                          ) : null}
                          {uploadedFile.error && (
                            <p className="text-xs text-red-500 mt-1">{uploadedFile.error}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadedFile.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metadata Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Video Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      {...form.register('title')}
                      placeholder="Enter video title"
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="machine_model">Machine Model</Label>
                    <Input
                      id="machine_model"
                      {...form.register('machine_model')}
                      placeholder="e.g., CNC-2000, Press-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    placeholder="Describe what this video covers..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="process_type">Process Type</Label>
                    <Input
                      id="process_type"
                      {...form.register('process_type')}
                      placeholder="e.g., Setup, Maintenance, Operation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tooling">Tooling</Label>
                    <Input
                      id="tooling"
                      {...form.register('tooling')}
                      placeholder="e.g., Drill bit, Cutting tool"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skill_level">Skill Level</Label>
                  <Select onValueChange={(value: string) => form.setValue('skill_level', value as 'beginner' | 'intermediate' | 'advanced')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="safety, setup, maintenance"
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                      form.setValue('tags', tags);
                    }}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={form.watch('is_public')}
                    onChange={(e) => form.setValue('is_public', e.target.checked)}
                  />
                  <Label htmlFor="is_public">Make this video public</Label>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={uploadedFiles.length === 0 || initiateUpload.isPending}
                className="min-w-32"
              >
                {initiateUpload.isPending ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-pulse" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Videos
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
