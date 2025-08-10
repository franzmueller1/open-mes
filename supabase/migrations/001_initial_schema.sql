-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE machine_status AS ENUM ('operational', 'maintenance', 'idle', 'error');
CREATE TYPE production_status AS ENUM ('planned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE quality_result AS ENUM ('passed', 'failed', 'pending');
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'operator', 'viewer', 'demo');

-- Create the products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    model VARCHAR(255) NOT NULL,
    description TEXT,
    specifications JSONB,
    release_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES auth.users(id)
);

-- Create the machines table
CREATE TABLE machines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    status machine_status DEFAULT 'idle',
    specifications JSONB,
    last_maintenance DATE,
    next_maintenance DATE,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create the employees table
CREATE TABLE employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    employee_number VARCHAR(50) UNIQUE,
    role user_role DEFAULT 'operator',
    department VARCHAR(100),
    hire_date DATE,
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create the materials table
CREATE TABLE materials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50),
    stock_quantity DECIMAL(10, 2) DEFAULT 0,
    min_stock_level DECIMAL(10, 2),
    max_stock_level DECIMAL(10, 2),
    supplier VARCHAR(255),
    cost_per_unit DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create the components table
CREATE TABLE components (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    specifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create the productions table
CREATE TABLE productions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    production_number VARCHAR(100) UNIQUE,
    product_id UUID REFERENCES products(id),
    machine_id UUID REFERENCES machines(id),
    employee_id UUID REFERENCES employees(id),
    status production_status DEFAULT 'planned',
    planned_quantity INT NOT NULL,
    actual_quantity INT DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create the quality_checks table
CREATE TABLE quality_checks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id),
    result quality_result DEFAULT 'pending',
    check_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    method VARCHAR(100),
    measurements JSONB,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create the material_consumption table
CREATE TABLE material_consumption (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id),
    quantity_used DECIMAL(10, 2) NOT NULL,
    unit_cost DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create the maintenance_records table
CREATE TABLE maintenance_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    machine_id UUID REFERENCES machines(id) ON DELETE CASCADE,
    performed_by UUID REFERENCES employees(id),
    maintenance_date DATE NOT NULL,
    maintenance_type VARCHAR(100),
    description TEXT,
    cost DECIMAL(10, 2),
    next_maintenance DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create the error_reports table
CREATE TABLE error_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
    machine_id UUID REFERENCES machines(id),
    reported_by UUID REFERENCES employees(id),
    error_code VARCHAR(50),
    description TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_productions_product_id ON productions(product_id);
CREATE INDEX idx_productions_machine_id ON productions(machine_id);
CREATE INDEX idx_productions_employee_id ON productions(employee_id);
CREATE INDEX idx_productions_status ON productions(status);
CREATE INDEX idx_productions_start_time ON productions(start_time);
CREATE INDEX idx_quality_checks_production_id ON quality_checks(production_id);
CREATE INDEX idx_quality_checks_result ON quality_checks(result);
CREATE INDEX idx_machines_status ON machines(status);
CREATE INDEX idx_error_reports_status ON error_reports(status);
CREATE INDEX idx_error_reports_severity ON error_reports(severity);

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_machines_updated_at BEFORE UPDATE ON machines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productions_updated_at BEFORE UPDATE ON productions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quality_checks_updated_at BEFORE UPDATE ON quality_checks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_records_updated_at BEFORE UPDATE ON maintenance_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_error_reports_updated_at BEFORE UPDATE ON error_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();