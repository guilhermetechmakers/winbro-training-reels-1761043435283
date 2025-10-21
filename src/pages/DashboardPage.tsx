import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Bell, 
  Play, 
  BookOpen, 
  Award, 
  Bookmark,
  TrendingUp,
  Users,
  ChevronRight,
  Grid3X3,
  List,
  Plus
} from 'lucide-react';

export function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data - in real app this would come from API
  const stats = [
    { label: 'Total Clips', value: '1,247', icon: Play, change: '+12%', trend: 'up' },
    { label: 'Courses', value: '89', icon: BookOpen, change: '+5%', trend: 'up' },
    { label: 'Certificates', value: '2,341', icon: Award, change: '+23%', trend: 'up' },
    { label: 'Bookmarks', value: '156', icon: Bookmark, change: '+8%', trend: 'up' },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'clip_viewed',
      title: 'Safety Protocol - Machine Startup',
      user: 'John Smith',
      time: '2 minutes ago',
      icon: Play,
    },
    {
      id: 2,
      type: 'course_completed',
      title: 'Advanced Welding Techniques',
      user: 'Sarah Johnson',
      time: '15 minutes ago',
      icon: Award,
    },
    {
      id: 3,
      type: 'clip_uploaded',
      title: 'Quality Control Process',
      user: 'Mike Chen',
      time: '1 hour ago',
      icon: Plus,
    },
  ];

  const recommendedClips = [
    {
      id: 1,
      title: 'Machine Maintenance Basics',
      duration: '0:28',
      thumbnail: '/api/placeholder/300/200',
      views: 1247,
      tags: ['maintenance', 'safety'],
      author: 'Training Team',
    },
    {
      id: 2,
      title: 'Quality Control Checklist',
      duration: '0:22',
      thumbnail: '/api/placeholder/300/200',
      views: 892,
      tags: ['quality', 'process'],
      author: 'Sarah Johnson',
    },
    {
      id: 3,
      title: 'Safety Equipment Usage',
      duration: '0:31',
      thumbnail: '/api/placeholder/300/200',
      views: 1563,
      tags: ['safety', 'equipment'],
      author: 'Safety Team',
    },
  ];

  const pinnedLibrary = {
    name: 'Manufacturing Operations',
    clips: 45,
    courses: 8,
    lastUpdated: '2 days ago',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-winbro-teal">
                Winbro
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/dashboard" className="text-foreground font-medium">
                  Dashboard
                </Link>
                <Link to="/library" className="text-muted-foreground hover:text-foreground">
                  Library
                </Link>
                <Link to="/courses" className="text-muted-foreground hover:text-foreground">
                  Courses
                </Link>
                <Link to="/analytics" className="text-muted-foreground hover:text-foreground">
                  Analytics
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Global Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clips, courses..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-winbro-error text-xs">
                  3
                </Badge>
              </Button>
              
              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Training Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, John!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your training content today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-elevation-200 transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-winbro-success mr-1" />
                      <span className="text-sm text-winbro-success">{stat.change}</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-winbro-teal/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-winbro-teal" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Activity
                  <Button variant="ghost" size="sm">
                    View all
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-winbro-teal/10 rounded-lg flex items-center justify-center">
                        <activity.icon className="h-5 w-5 text-winbro-teal" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Pinned Library */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload New Clip
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Team Member
                </Button>
              </CardContent>
            </Card>

            {/* Pinned Library */}
            <Card>
              <CardHeader>
                <CardTitle>Pinned Library</CardTitle>
                <CardDescription>{pinnedLibrary.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Clips</span>
                    <span className="font-medium">{pinnedLibrary.clips}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Courses</span>
                    <span className="font-medium">{pinnedLibrary.courses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">{pinnedLibrary.lastUpdated}</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View Library
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Clips */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Recommended for You</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {recommendedClips.map((clip) => (
              <Card key={clip.id} className="group hover:shadow-elevation-200 transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={clip.thumbnail}
                      alt={clip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Button size="sm" className="bg-white text-black hover:bg-white/90">
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/80 text-white">
                      {clip.duration}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-winbro-teal transition-colors">
                      {clip.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>{clip.author}</span>
                      <span>{clip.views} views</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {clip.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
