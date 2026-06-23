-- AI Job Delivery Agent Database Schema
-- PostgreSQL

-- Create database (run as superuser)
-- CREATE DATABASE ai_job_delivery;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Message templates table
CREATE TABLE IF NOT EXISTS message_templates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    keywords TEXT, -- JSON array
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_templates_user_id ON message_templates(user_id);

-- Job configurations table
CREATE TABLE IF NOT EXISTS job_configs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    keywords TEXT NOT NULL, -- JSON array
    cities TEXT, -- JSON array
    salary_range VARCHAR(50),
    education VARCHAR(50),
    company_size TEXT, -- JSON array
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_configs_user_id ON job_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_job_configs_is_active ON job_configs(is_active);

-- Delivery records table (CRM)
CREATE TABLE IF NOT EXISTS delivery_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES message_templates(id) ON DELETE SET NULL,
    job_config_id INTEGER REFERENCES job_configs(id) ON DELETE SET NULL,

    -- Job info
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    salary VARCHAR(100),
    location VARCHAR(255),
    job_url TEXT,
    job_description TEXT,

    -- AI scoring
    ai_score DECIMAL(5,2),
    ai_reason TEXT,

    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'replied', 'interview', 'offer', 'rejected')),
    sent_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,

    -- Additional info
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_delivery_records_user_id ON delivery_records(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_records_status ON delivery_records(status);
CREATE INDEX IF NOT EXISTS idx_delivery_records_sent_at ON delivery_records(sent_at);
CREATE INDEX IF NOT EXISTS idx_delivery_records_company ON delivery_records(company_name);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_message_templates_updated_at ON message_templates;
CREATE TRIGGER update_message_templates_updated_at
    BEFORE UPDATE ON message_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_configs_updated_at ON job_configs;
CREATE TRIGGER update_job_configs_updated_at
    BEFORE UPDATE ON job_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_delivery_records_updated_at ON delivery_records;
CREATE TRIGGER update_delivery_records_updated_at
    BEFORE UPDATE ON delivery_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
