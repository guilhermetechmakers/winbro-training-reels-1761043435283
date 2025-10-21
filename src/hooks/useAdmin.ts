import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/lib/supabase';

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

// Get admin dashboard data
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockDashboardData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get admin metrics
export function useAdminMetrics(organizationId?: string) {
  return useQuery({
    queryKey: ['admin-metrics', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_metrics')
        .select('*')
        .eq(organizationId ? 'organization_id' : 'organization_id', organizationId || null)
        .order('metric_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

// Get content reviews
export function useContentReviews() {
  return useQuery({
    queryKey: ['content-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

// Update content review
export function useUpdateContentReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      reviewId, 
      updates 
    }: { 
      reviewId: string; 
      updates: any 
    }) => {
      const { data, error } = await supabase
        .from('content_reviews')
        .update(updates)
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });
}

// Get review queue count
export function useReviewQueueCount() {
  return useQuery({
    queryKey: ['review-queue-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('content_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) throw error;
      return count || 0;
    },
  });
}

// Get flagged content count
export function useFlaggedContentCount() {
  return useQuery({
    queryKey: ['flagged-content-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('content_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .not('flagged_reason', 'is', null);

      if (error) throw error;
      return count || 0;
    },
  });
}
