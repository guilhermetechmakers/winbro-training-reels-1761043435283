/**
 * RBAC (Role-Based Access Control) Types
 * Generated: 2024-12-13T12:00:00Z
 */

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  organization_id: string | null;
  assigned_by: string | null;
  assigned_at: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_date: string;
  organization_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ContentReview {
  id: string;
  content_id: string;
  content_type: 'clip' | 'course';
  reviewer_id: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  review_notes: string | null;
  flagged_reason: string | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

// Insert types
export interface RoleInsert {
  id?: string;
  name: string;
  display_name: string;
  description?: string | null;
  is_system_role?: boolean;
}

export interface PermissionInsert {
  id?: string;
  name: string;
  resource: string;
  action: string;
  description?: string | null;
}

export interface UserRoleInsert {
  id?: string;
  user_id: string;
  role_id: string;
  organization_id?: string | null;
  assigned_by?: string | null;
  expires_at?: string | null;
  is_active?: boolean;
}

export interface AdminMetricInsert {
  id?: string;
  metric_name: string;
  metric_value: number;
  metric_date: string;
  organization_id?: string | null;
  metadata?: Record<string, any>;
}

export interface ContentReviewInsert {
  id?: string;
  content_id: string;
  content_type: 'clip' | 'course';
  reviewer_id?: string | null;
  status?: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  review_notes?: string | null;
  flagged_reason?: string | null;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

// Update types
export interface RoleUpdate {
  name?: string;
  display_name?: string;
  description?: string | null;
  is_system_role?: boolean;
}

export interface PermissionUpdate {
  name?: string;
  resource?: string;
  action?: string;
  description?: string | null;
}

export interface UserRoleUpdate {
  role_id?: string;
  organization_id?: string | null;
  expires_at?: string | null;
  is_active?: boolean;
}

export interface AdminMetricUpdate {
  metric_name?: string;
  metric_value?: number;
  metric_date?: string;
  organization_id?: string | null;
  metadata?: Record<string, any>;
}

export interface ContentReviewUpdate {
  reviewer_id?: string | null;
  status?: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  review_notes?: string | null;
  flagged_reason?: string | null;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  reviewed_at?: string | null;
}

// Extended types with relationships
export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export interface UserRoleWithDetails extends UserRole {
  role: Role;
  assigned_by_user?: {
    id: string;
    full_name: string | null;
    email: string;
  };
}

export interface AdminDashboardData {
  kpi_cards: {
    clips_published: number;
    views_last_30d: number;
    active_users: number;
    certificates_issued: number;
  };
  charts: {
    daily_views: Array<{
      date: string;
      views: number;
    }>;
    uploads: Array<{
      date: string;
      uploads: number;
    }>;
    search_success_rate: Array<{
      date: string;
      success_rate: number;
    }>;
    per_customer_usage: Array<{
      organization_name: string;
      usage: number;
    }>;
  };
  outstanding_tasks: {
    review_queue: number;
    flagged_content: number;
  };
  customers: Array<{
    id: string;
    name: string;
    user_count: number;
    clip_count: number;
    last_activity: string;
  }>;
}

// Role names const for type safety
export const RoleName = {
  ADMIN: 'admin',
  CUSTOMER_ADMIN: 'customer_admin',
  TRAINER: 'trainer',
  LEARNER: 'learner',
  REVIEWER: 'reviewer',
} as const;

export type RoleName = typeof RoleName[keyof typeof RoleName];

// Permission names const for type safety
export const PermissionName = {
  // User management
  USERS_CREATE: 'users.create',
  USERS_READ: 'users.read',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_MANAGE_ROLES: 'users.manage_roles',
  
  // Content management
  CONTENT_CREATE: 'content.create',
  CONTENT_READ: 'content.read',
  CONTENT_UPDATE: 'content.update',
  CONTENT_DELETE: 'content.delete',
  CONTENT_MODERATE: 'content.moderate',
  CONTENT_PUBLISH: 'content.publish',
  
  // Analytics and reporting
  ANALYTICS_READ: 'analytics.read',
  ANALYTICS_EXPORT: 'analytics.export',
  
  // Organization management
  ORG_READ: 'org.read',
  ORG_UPDATE: 'org.update',
  ORG_BILLING: 'org.billing',
  
  // System administration
  SYSTEM_ADMIN: 'system.admin',
  SYSTEM_METRICS: 'system.metrics',
} as const;

export type PermissionName = typeof PermissionName[keyof typeof PermissionName];

// Helper type for checking permissions
export type HasPermission = (permission: PermissionName) => boolean;

// Helper type for checking roles
export type HasRole = (role: RoleName) => boolean;
