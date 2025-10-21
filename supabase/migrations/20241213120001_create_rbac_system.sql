-- =====================================================
-- Migration: Create RBAC System
-- Created: 2024-12-13T12:00:01Z
-- Tables: roles, permissions, user_roles, admin_metrics
-- Purpose: Implement role-based access control system
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function for updated_at (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLE: roles
-- Purpose: Define system roles (admin, trainer, learner, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT roles_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT roles_display_name_not_empty CHECK (length(trim(display_name)) > 0)
);

-- =====================================================
-- TABLE: permissions
-- Purpose: Define granular permissions for resources
-- =====================================================
CREATE TABLE IF NOT EXISTS permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT permissions_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT permissions_resource_not_empty CHECK (length(trim(resource)) > 0),
  CONSTRAINT permissions_action_not_empty CHECK (length(trim(action)) > 0)
);

-- =====================================================
-- TABLE: role_permissions
-- Purpose: Many-to-many relationship between roles and permissions
-- =====================================================
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure unique role-permission combinations
  CONSTRAINT role_permissions_unique UNIQUE (role_id, permission_id)
);

-- =====================================================
-- TABLE: user_roles
-- Purpose: Assign roles to users within organizations
-- =====================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT user_roles_unique_active UNIQUE (user_id, role_id, organization_id) 
    DEFERRABLE INITIALLY DEFERRED
);

-- =====================================================
-- TABLE: admin_metrics
-- Purpose: Store aggregated metrics for admin dashboard
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_date DATE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT admin_metrics_name_not_empty CHECK (length(trim(metric_name)) > 0),
  CONSTRAINT admin_metrics_value_positive CHECK (metric_value >= 0)
);

-- =====================================================
-- TABLE: content_reviews
-- Purpose: Track content moderation and review queue
-- =====================================================
CREATE TABLE IF NOT EXISTS content_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content_id UUID NOT NULL, -- References clips or courses
  content_type TEXT NOT NULL CHECK (content_type IN ('clip', 'course')),
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  review_notes TEXT,
  flagged_reason TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  reviewed_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT content_reviews_content_id_not_empty CHECK (content_id IS NOT NULL),
  CONSTRAINT content_reviews_content_type_not_empty CHECK (length(trim(content_type)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS roles_name_idx ON roles(name);
CREATE INDEX IF NOT EXISTS permissions_resource_action_idx ON permissions(resource, action);
CREATE INDEX IF NOT EXISTS role_permissions_role_id_idx ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS role_permissions_permission_id_idx ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS user_roles_role_id_idx ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS user_roles_organization_id_idx ON user_roles(organization_id);
CREATE INDEX IF NOT EXISTS user_roles_active_idx ON user_roles(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS admin_metrics_name_date_idx ON admin_metrics(metric_name, metric_date);
CREATE INDEX IF NOT EXISTS admin_metrics_organization_id_idx ON admin_metrics(organization_id);
CREATE INDEX IF NOT EXISTS content_reviews_status_idx ON content_reviews(status);
CREATE INDEX IF NOT EXISTS content_reviews_priority_idx ON content_reviews(priority);
CREATE INDEX IF NOT EXISTS content_reviews_created_at_idx ON content_reviews(created_at DESC);

-- Auto-update triggers
DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_permissions_updated_at ON permissions;
CREATE TRIGGER update_permissions_updated_at
  BEFORE UPDATE ON permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_roles_updated_at ON user_roles;
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_metrics_updated_at ON admin_metrics;
CREATE TRIGGER update_admin_metrics_updated_at
  BEFORE UPDATE ON admin_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_reviews_updated_at ON content_reviews;
CREATE TRIGGER update_content_reviews_updated_at
  BEFORE UPDATE ON content_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Roles and permissions are readable by all authenticated users
CREATE POLICY "roles_select_all" ON roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "permissions_select_all" ON permissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "role_permissions_select_all" ON role_permissions FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies: User roles - users can see their own roles
CREATE POLICY "user_roles_select_own" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_roles_select_org_admin" ON user_roles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    JOIN roles r ON ur.role_id = r.id 
    WHERE ur.user_id = auth.uid() 
    AND r.name IN ('admin', 'customer_admin')
    AND ur.organization_id = user_roles.organization_id
    AND ur.is_active = true
  )
);

-- RLS Policies: Admin metrics - only admins can access
CREATE POLICY "admin_metrics_select_admin" ON admin_metrics FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    JOIN roles r ON ur.role_id = r.id 
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'admin'
    AND ur.is_active = true
  )
);

-- RLS Policies: Content reviews - reviewers and admins can access
CREATE POLICY "content_reviews_select_reviewer" ON content_reviews FOR SELECT USING (
  reviewer_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur 
    JOIN roles r ON ur.role_id = r.id 
    WHERE ur.user_id = auth.uid() 
    AND r.name IN ('admin', 'reviewer')
    AND ur.is_active = true
  )
);

-- Insert default system roles
INSERT INTO roles (name, display_name, description, is_system_role) VALUES
  ('admin', 'Platform Admin', 'Full platform access and management', true),
  ('customer_admin', 'Customer Admin', 'Organization-level administration', true),
  ('trainer', 'Trainer', 'Content creation and course management', true),
  ('learner', 'Learner', 'Access to assigned content and courses', true),
  ('reviewer', 'Content Reviewer', 'Content moderation and review', true)
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, resource, action, description) VALUES
  -- User management
  ('users.create', 'users', 'create', 'Create new users'),
  ('users.read', 'users', 'read', 'View user information'),
  ('users.update', 'users', 'update', 'Update user information'),
  ('users.delete', 'users', 'delete', 'Delete users'),
  ('users.manage_roles', 'users', 'manage_roles', 'Assign and modify user roles'),
  
  -- Content management
  ('content.create', 'content', 'create', 'Create new content'),
  ('content.read', 'content', 'read', 'View content'),
  ('content.update', 'content', 'update', 'Update content'),
  ('content.delete', 'content', 'delete', 'Delete content'),
  ('content.moderate', 'content', 'moderate', 'Moderate and review content'),
  ('content.publish', 'content', 'publish', 'Publish content'),
  
  -- Analytics and reporting
  ('analytics.read', 'analytics', 'read', 'View analytics and reports'),
  ('analytics.export', 'analytics', 'export', 'Export analytics data'),
  
  -- Organization management
  ('org.read', 'organization', 'read', 'View organization information'),
  ('org.update', 'organization', 'update', 'Update organization settings'),
  ('org.billing', 'organization', 'billing', 'Manage billing and subscriptions'),
  
  -- System administration
  ('system.admin', 'system', 'admin', 'Full system administration'),
  ('system.metrics', 'system', 'metrics', 'View system metrics')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
WITH role_perms AS (
  SELECT r.id as role_id, p.id as permission_id
  FROM roles r, permissions p
  WHERE (r.name = 'admin' AND p.name LIKE 'system.%') OR
        (r.name = 'admin' AND p.name LIKE 'users.%') OR
        (r.name = 'admin' AND p.name LIKE 'content.%') OR
        (r.name = 'admin' AND p.name LIKE 'analytics.%') OR
        (r.name = 'admin' AND p.name LIKE 'org.%') OR
        (r.name = 'customer_admin' AND p.name IN ('users.read', 'users.update', 'users.manage_roles', 'content.read', 'content.update', 'content.moderate', 'analytics.read', 'org.read', 'org.update', 'org.billing')) OR
        (r.name = 'trainer' AND p.name IN ('content.create', 'content.read', 'content.update', 'users.read')) OR
        (r.name = 'learner' AND p.name IN ('content.read')) OR
        (r.name = 'reviewer' AND p.name IN ('content.read', 'content.moderate', 'content.publish', 'users.read'))
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT role_id, permission_id FROM role_perms
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Documentation
COMMENT ON TABLE roles IS 'System roles for RBAC (Role-Based Access Control)';
COMMENT ON TABLE permissions IS 'Granular permissions for resources and actions';
COMMENT ON TABLE role_permissions IS 'Many-to-many relationship between roles and permissions';
COMMENT ON TABLE user_roles IS 'User role assignments within organizations';
COMMENT ON TABLE admin_metrics IS 'Aggregated metrics for admin dashboard';
COMMENT ON TABLE content_reviews IS 'Content moderation and review queue';
