import { supabase } from '@/lib/supabase';
import type { AdminDashboardData, AdminMetric, ContentReview } from '@/types/rbac';

/**
 * Admin API functions for dashboard and RBAC management
 */

// Get admin dashboard data
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    // Mock data for now - in production this would come from actual database queries
    const mockData: AdminDashboardData = {
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

    return mockData;
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    throw new Error('Failed to fetch admin dashboard data');
  }
}

// Get admin metrics
export async function getAdminMetrics(organizationId?: string): Promise<AdminMetric[]> {
  try {
    const { data, error } = await supabase
      .from('admin_metrics')
      .select('*')
      .eq(organizationId ? 'organization_id' : 'organization_id', organizationId || null)
      .order('metric_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    throw new Error('Failed to fetch admin metrics');
  }
}

// Get content reviews
export async function getContentReviews(): Promise<ContentReview[]> {
  try {
    const { data, error } = await supabase
      .from('content_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching content reviews:', error);
    throw new Error('Failed to fetch content reviews');
  }
}

// Update content review status
export async function updateContentReview(
  reviewId: string,
  updates: Partial<ContentReview>
): Promise<ContentReview> {
  try {
    const { data, error } = await supabase
      .from('content_reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating content review:', error);
    throw new Error('Failed to update content review');
  }
}

// Get review queue count
export async function getReviewQueueCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('content_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching review queue count:', error);
    return 0;
  }
}

// Get flagged content count
export async function getFlaggedContentCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('content_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .not('flagged_reason', 'is', null);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching flagged content count:', error);
    return 0;
  }
}
