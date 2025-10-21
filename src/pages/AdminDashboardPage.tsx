import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  Eye, 
  Users, 
  Award,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Flag,
  Building2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data for demonstration
const mockDashboardData = {
  kpi_cards: {
    clips_published: 1247,
    views_last_30d: 15680,
    active_users: 342,
    certificates_issued: 89,
  },
  charts: {
    daily_views: [
      { date: '2024-12-01', views: 450 },
      { date: '2024-12-02', views: 520 },
      { date: '2024-12-03', views: 480 },
      { date: '2024-12-04', views: 610 },
      { date: '2024-12-05', views: 580 },
      { date: '2024-12-06', views: 720 },
      { date: '2024-12-07', views: 680 },
    ],
    uploads: [
      { date: '2024-12-01', uploads: 12 },
      { date: '2024-12-02', uploads: 18 },
      { date: '2024-12-03', uploads: 15 },
      { date: '2024-12-04', uploads: 22 },
      { date: '2024-12-05', uploads: 19 },
      { date: '2024-12-06', uploads: 25 },
      { date: '2024-12-07', uploads: 21 },
    ],
    search_success_rate: [
      { date: '2024-12-01', success_rate: 87.5 },
      { date: '2024-12-02', success_rate: 89.2 },
      { date: '2024-12-03', success_rate: 91.1 },
      { date: '2024-12-04', success_rate: 88.7 },
      { date: '2024-12-05', success_rate: 92.3 },
      { date: '2024-12-06', success_rate: 90.8 },
      { date: '2024-12-07', success_rate: 93.1 },
    ],
    per_customer_usage: [
      { organization_name: 'Manufacturing Corp A', usage: 2450 },
      { organization_name: 'Industrial Solutions B', usage: 1890 },
      { organization_name: 'Tech Manufacturing C', usage: 3200 },
      { organization_name: 'Production Systems D', usage: 1560 },
      { organization_name: 'Advanced Manufacturing E', usage: 2780 },
    ],
  },
  outstanding_tasks: {
    review_queue: 23,
    flagged_content: 7,
  },
  customers: [
    {
      id: '1',
      name: 'Manufacturing Corp A',
      user_count: 45,
      clip_count: 234,
      last_activity: '2024-12-13T10:30:00Z',
    },
    {
      id: '2',
      name: 'Industrial Solutions B',
      user_count: 32,
      clip_count: 189,
      last_activity: '2024-12-13T09:15:00Z',
    },
    {
      id: '3',
      name: 'Tech Manufacturing C',
      user_count: 67,
      clip_count: 456,
      last_activity: '2024-12-13T11:45:00Z',
    },
    {
      id: '4',
      name: 'Production Systems D',
      user_count: 28,
      clip_count: 167,
      last_activity: '2024-12-12T16:20:00Z',
    },
    {
      id: '5',
      name: 'Advanced Manufacturing E',
      user_count: 52,
      clip_count: 298,
      last_activity: '2024-12-13T08:30:00Z',
    },
  ],
};

export function AdminDashboardPage() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockDashboardData;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Dashboard</h1>
            <p className="text-muted-foreground">Failed to load admin dashboard data. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const { kpi_cards, charts, outstanding_tasks, customers } = dashboardData!;

  const kpiData = [
    {
      title: 'Clips Published',
      value: kpi_cards.clips_published.toLocaleString(),
      icon: Video,
      trend: 12.5,
      color: 'text-winbro-teal',
      bgColor: 'bg-winbro-teal/10',
      borderColor: 'border-winbro-teal/20',
    },
    {
      title: 'Views (30d)',
      value: kpi_cards.views_last_30d.toLocaleString(),
      icon: Eye,
      trend: 8.3,
      color: 'text-winbro-amber',
      bgColor: 'bg-winbro-amber/10',
      borderColor: 'border-winbro-amber/20',
    },
    {
      title: 'Active Users',
      value: kpi_cards.active_users.toLocaleString(),
      icon: Users,
      trend: 15.2,
      color: 'text-winbro-success',
      bgColor: 'bg-winbro-success/10',
      borderColor: 'border-winbro-success/20',
    },
    {
      title: 'Certificates Issued',
      value: kpi_cards.certificates_issued.toLocaleString(),
      icon: Award,
      trend: 22.1,
      color: 'text-winbro-info',
      bgColor: 'bg-winbro-info/10',
      borderColor: 'border-winbro-info/20',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform metrics and management overview</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            const isPositive = kpi.trend > 0;
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
            
            return (
              <Card 
                key={kpi.title}
                className={`${kpi.borderColor} hover:shadow-elevation-200 transition-all duration-200 hover:scale-105`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-2">
                    {kpi.value}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={isPositive ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      <TrendIcon className="h-3 w-3 mr-1" />
                      {Math.abs(kpi.trend)}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      vs last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Views Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Views</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={charts.daily_views}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#0B6B6F" 
                    strokeWidth={2}
                    dot={{ fill: '#0B6B6F' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Uploads Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.uploads}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="uploads" fill="#F3A712" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Search Success Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Search Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={charts.search_success_rate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="success_rate" 
                    stroke="#2E8B57" 
                    strokeWidth={2}
                    dot={{ fill: '#2E8B57' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Per Customer Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.per_customer_usage} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="organization_name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#2B7AE4" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Outstanding Tasks and Customer List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Outstanding Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-winbro-amber" />
                <span>Outstanding Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-winbro-amber/10 rounded-lg">
                    <Flag className="h-4 w-4 text-winbro-amber" />
                  </div>
                  <div>
                    <p className="font-medium">Review Queue</p>
                    <p className="text-sm text-muted-foreground">Content pending review</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-winbro-amber">
                    {outstanding_tasks.review_queue}
                  </p>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-winbro-error/10 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-winbro-error" />
                  </div>
                  <div>
                    <p className="font-medium">Flagged Content</p>
                    <p className="text-sm text-muted-foreground">Requires attention</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-winbro-error">
                    {outstanding_tasks.flagged_content}
                  </p>
                  <Button size="sm" variant="outline">
                    Investigate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer List Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-winbro-teal" />
                <span>Customer Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customers.slice(0, 5).map((customer) => (
                  <div 
                    key={customer.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-winbro-teal/10 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-winbro-teal" />
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{customer.user_count} users</span>
                          <span>•</span>
                          <span>{customer.clip_count} clips</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(customer.last_activity).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t">
                  <Button variant="outline" className="w-full">
                    View All Customers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
