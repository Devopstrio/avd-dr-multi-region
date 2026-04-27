-- Devopstrio AVD Multi-Region Disaster Recovery
-- Core Resilience & Failover Database Schema
-- Target: PostgreSQL 15+

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Identity & Tenancy
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    azure_tenant_id VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'DROperator', -- Admin, DROperator, Viewer
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Regional Topology
CREATE TABLE IF NOT EXISTS regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL, -- e.g., uksouth, northeurope
    friendly_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Healthy', -- Healthy, Degraded, Critical, Maintenance
    latency_ms INT,
    last_ping TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS host_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    primary_region_id UUID REFERENCES regions(id),
    secondary_region_id UUID REFERENCES regions(id),
    dr_model VARCHAR(50) DEFAULT 'WarmStandby', -- ActiveActive, ActivePassive, WarmStandby, ColdStandby
    rto_target_mins INT DEFAULT 30,
    rpo_target_mins INT DEFAULT 5,
    status VARCHAR(50) DEFAULT 'In-Sync'
);

-- 3. Failover & Orchestration
CREATE TABLE IF NOT EXISTS failover_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_pool_id UUID REFERENCES host_pools(id),
    initiated_by UUID REFERENCES users(id),
    source_region_id UUID REFERENCES regions(id),
    target_region_id UUID REFERENCES regions(id),
    event_type VARCHAR(50) DEFAULT 'Emergency', -- Emergency, ScheduledTest, Failback
    status VARCHAR(50) DEFAULT 'Running', -- Running, Completed, Failed, RolledBack
    logs TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Replication Tracking
CREATE TABLE IF NOT EXISTS replication_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type VARCHAR(100) NOT NULL, -- Profile, Image, AppPackage, Config
    source_resource_id TEXT NOT NULL,
    target_resource_id TEXT NOT NULL,
    last_sync_status VARCHAR(50),
    last_sync_timestamp TIMESTAMP WITH TIME ZONE,
    sync_lag_seconds INT
);

-- 5. Profiles & Storage
CREATE TABLE IF NOT EXISTS profile_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    region_id UUID REFERENCES regions(id),
    storage_account_name VARCHAR(255) NOT NULL,
    share_name VARCHAR(255) NOT NULL,
    used_gb FLOAT,
    quota_gb FLOAT,
    replication_enabled BOOLEAN DEFAULT TRUE
);

-- 6. Disaster Recovery Testing
CREATE TABLE IF NOT EXISTS dr_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_pool_id UUID REFERENCES host_pools(id),
    test_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    carried_out_by UUID REFERENCES users(id),
    result VARCHAR(20), -- Pass, Fail, Partial
    observations TEXT,
    evidence_file_path TEXT
);

-- 7. Audit & Reporting
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    report_type VARCHAR(100) NOT NULL, -- RTO_Compliance, Regional_Health, Audit_Log
    file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    resource_id VARCHAR(255),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optimization Indexes
CREATE INDEX idx_failover_status ON failover_events(status);
CREATE INDEX idx_replication_timestamp ON replication_jobs(last_sync_timestamp);
CREATE INDEX idx_dr_test_pool ON dr_tests(host_pool_id);
CREATE INDEX idx_regions_status ON regions(status);
