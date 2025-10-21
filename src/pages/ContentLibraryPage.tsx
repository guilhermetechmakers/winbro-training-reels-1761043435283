import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Filter, Grid3X3, List, Search } from 'lucide-react';

export function ContentLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Content Library</h1>
          <p className="text-muted-foreground">Browse and search through all available training clips</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clips..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="group hover:shadow-elevation-200 transition-shadow">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-winbro-teal/20 to-winbro-amber/20 flex items-center justify-center">
                    <Play className="h-12 w-12 text-winbro-teal" />
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/80 text-white">
                    0:28
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">Sample Training Clip {i}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>Training Team</span>
                    <span>1,247 views</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">safety</Badge>
                    <Badge variant="secondary" className="text-xs">maintenance</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
