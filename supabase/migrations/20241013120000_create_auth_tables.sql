-- =====================================================
-- Migration: Create Authentication Tables
-- Created: 2024-10-13T12:00:00Z
-- Tables: users, organizations
-- Purpose: Set up user authentication and organization management
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
-- TABLE: organizations
-- Purpose: Store organization information for multi-tenancy
-- =====================================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  sso_enabled BOOLEAN DEFAULT false,
  sso_provider TEXT CHECK (sso_provider IN ('saml', 'oauth2', 'google', 'microsoft')),
  sso_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT organizations_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT organizations_domain_valid CHECK (domain IS NULL OR domain ~ '^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS organizations_domain_idx ON organizations(domain) WHERE domain IS NOT NULL;
CREATE INDEX IF NOT EXISTS organizations_created_at_idx ON organizations(created_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Organizations are public for now (can be restricted later)
CREATE POLICY "organizations_select_all"
  ON organizations FOR SELECT
  USING (true);

CREATE POLICY "organizations_insert_admin"
  ON organizations FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "organizations_update_admin"
  ON organizations FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- TABLE: users
-- Purpose: Store user profiles and authentication data
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'learner' CHECK (role IN ('admin', 'trainer', 'learner', 'customer_admin', 'reviewer')),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_login TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT users_email_valid CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$'),
  CONSTRAINT users_full_name_not_empty CHECK (full_name IS NULL OR length(trim(full_name)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_organization_id_idx ON users(organization_id);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS users_last_login_idx ON users(last_login DESC) WHERE last_login IS NOT NULL;

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data and organization data
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_select_organization"
  ON users FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "users_insert_own"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_delete_own"
  ON users FOR DELETE
  USING (auth.uid() = id);

-- =====================================================
-- FUNCTIONS
-- Purpose: Helper functions for authentication
-- =====================================================

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, avatar_url, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to update user profile when auth.users is updated
CREATE OR REPLACE FUNCTION handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET
    email = NEW.email,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', users.full_name),
    avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', users.avatar_url),
    is_verified = NEW.email_confirmed_at IS NOT NULL,
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update user profile when auth.users is updated
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_update();

-- Function to update last_login timestamp
CREATE OR REPLACE FUNCTION update_last_login(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET last_login = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DOCUMENTATION
-- =====================================================
COMMENT ON TABLE organizations IS 'Organizations for multi-tenant support';
COMMENT ON COLUMN organizations.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN organizations.name IS 'Organization name';
COMMENT ON COLUMN organizations.domain IS 'Organization domain for SSO';
COMMENT ON COLUMN organizations.sso_enabled IS 'Whether SSO is enabled for this organization';
COMMENT ON COLUMN organizations.sso_provider IS 'SSO provider type';
COMMENT ON COLUMN organizations.sso_metadata IS 'SSO configuration metadata';

COMMENT ON TABLE users IS 'User profiles and authentication data';
COMMENT ON COLUMN users.id IS 'Primary key (UUID v4), matches auth.users.id';
COMMENT ON COLUMN users.email IS 'User email address';
COMMENT ON COLUMN users.full_name IS 'User full name';
COMMENT ON COLUMN users.avatar_url IS 'User avatar URL';
COMMENT ON COLUMN users.role IS 'User role for RBAC';
COMMENT ON COLUMN users.organization_id IS 'Organization this user belongs to';
COMMENT ON COLUMN users.is_verified IS 'Whether user email is verified';
COMMENT ON COLUMN users.last_login IS 'Last login timestamp';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS organizations CASCADE;
-- DROP FUNCTION IF EXISTS handle_new_user();
-- DROP FUNCTION IF EXISTS handle_user_update();
-- DROP FUNCTION IF EXISTS update_last_login(UUID);