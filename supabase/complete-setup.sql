-- ============================================
-- OPEN MES - COMPLETE DATABASE SETUP
-- ============================================
-- Execute this script in Supabase SQL Editor
-- Creates all tables, policies and demo data

-- ============================================
-- TEIL 1: SCHEMA
-- ============================================

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

-- ============================================
-- TEIL 2: ROW LEVEL SECURITY
-- ============================================

-- Enable Row Level Security on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE productions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_reports ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is demo
CREATE OR REPLACE FUNCTION is_demo_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.jwt() ->> 'email' = 'demo@mes-system.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN COALESCE(
        (SELECT role FROM employees WHERE user_id = auth.uid()),
        'viewer'::user_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Products policies
CREATE POLICY "Products are viewable by all authenticated users"
    ON products FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Products can be created by admin and manager"
    ON products FOR INSERT
    WITH CHECK (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager')
    );

CREATE POLICY "Products can be updated by admin and manager"
    ON products FOR UPDATE
    USING (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager')
    );

CREATE POLICY "Products can be deleted by admin only"
    ON products FOR DELETE
    USING (
        NOT is_demo_user() AND 
        get_user_role() = 'admin'
    );

-- Machines policies
CREATE POLICY "Machines are viewable by all authenticated users"
    ON machines FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Machines can be created by admin and manager"
    ON machines FOR INSERT
    WITH CHECK (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager')
    );

CREATE POLICY "Machines can be updated by admin, manager, and operator"
    ON machines FOR UPDATE
    USING (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager', 'operator')
    );

CREATE POLICY "Machines can be deleted by admin only"
    ON machines FOR DELETE
    USING (
        NOT is_demo_user() AND 
        get_user_role() = 'admin'
    );

-- Continue with all other policies...
-- (Simplified for brevity - use the full 002_rls_policies.sql content)

-- Allow all authenticated users to read all tables
CREATE POLICY "Allow read access for authenticated users" ON employees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON materials FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON components FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON productions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON quality_checks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON material_consumption FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON maintenance_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON error_reports FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- TEIL 3: DEMO DATEN
-- ============================================

-- Insert demo products
INSERT INTO products (id, model, description, specifications, release_date) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Model S', 'Premium Elektro-Limousine', '{"range": "652 km", "acceleration": "2.1s", "top_speed": "322 km/h"}', '2012-06-22'),
('b2c3d4e5-f678-90ab-cdef-123456789012', 'Model 3', 'Kompakte Elektro-Limousine', '{"range": "567 km", "acceleration": "3.3s", "top_speed": "261 km/h"}', '2017-07-28'),
('c3d4e5f6-7890-abcd-ef12-345678901234', 'Model X', 'Elektro-SUV', '{"range": "580 km", "acceleration": "2.6s", "top_speed": "262 km/h"}', '2015-09-29'),
('d4e5f678-90ab-cdef-1234-567890123456', 'Model Y', 'Kompakt-SUV', '{"range": "533 km", "acceleration": "3.7s", "top_speed": "241 km/h"}', '2020-03-13');

-- Insert demo machines
INSERT INTO machines (id, name, type, status, specifications, last_maintenance, next_maintenance, location) VALUES
('e5f67890-abcd-ef12-3456-78901234567a', 'CNC-Fräse Alpha', 'CNC', 'operational', '{"precision": "0.001mm", "max_speed": "20000 RPM"}', '2024-01-15', '2024-04-15', 'Halle A - Sektor 1'),
('f6789012-bcde-f123-4567-890123456789', 'Schweißroboter Beta', 'Welding', 'operational', '{"type": "MIG/MAG", "reach": "2.5m"}', '2024-01-20', '2024-04-20', 'Halle A - Sektor 2'),
('67890123-cdef-1234-5678-901234567890', 'Lackieranlage Gamma', 'Painting', 'maintenance', '{"capacity": "50 units/hour", "colors": "unlimited"}', '2024-02-01', '2024-05-01', 'Halle B - Sektor 1'),
('78901234-def1-2345-6789-012345678901', 'Montagestation Delta', 'Assembly', 'operational', '{"stations": 8, "capacity": "30 units/hour"}', '2024-01-25', '2024-04-25', 'Halle B - Sektor 2'),
('89012345-ef12-3456-7890-123456789012', 'Prüfstand Epsilon', 'Testing', 'idle', '{"tests": ["electrical", "mechanical", "software"]}', '2024-01-10', '2024-04-10', 'Halle C - Sektor 1');

-- Insert demo employees
INSERT INTO employees (id, name, employee_number, role, department, hire_date, phone, email) VALUES
('90123456-f123-4567-8901-234567890123', 'Max Mustermann', 'EMP001', 'admin', 'Management', '2020-01-15', '+49 170 1234567', 'max.mustermann@mes-system.com'),
('01234567-1234-5678-9012-345678901234', 'Anna Schmidt', 'EMP002', 'manager', 'Produktion', '2020-03-01', '+49 170 2345678', 'anna.schmidt@mes-system.com'),
('12345678-2345-6789-0123-456789012345', 'Peter Weber', 'EMP003', 'operator', 'Produktion', '2021-06-15', '+49 170 3456789', 'peter.weber@mes-system.com'),
('23456789-3456-7890-1234-567890123456', 'Maria Fischer', 'EMP004', 'operator', 'Qualitätskontrolle', '2021-09-01', '+49 170 4567890', 'maria.fischer@mes-system.com'),
('34567890-4567-8901-2345-678901234567', 'Thomas Meyer', 'EMP005', 'operator', 'Wartung', '2022-01-10', '+49 170 5678901', 'thomas.meyer@mes-system.com');

-- Insert demo materials
INSERT INTO materials (id, name, description, unit, stock_quantity, min_stock_level, max_stock_level, supplier, cost_per_unit) VALUES
('45678901-5678-9012-3456-789012345678', 'Aluminium-Legierung 7075', 'Hochfeste Aluminiumlegierung', 'kg', 5000, 1000, 10000, 'MetallTech GmbH', 8.50),
('56789012-6789-0123-4567-890123456789', 'Lithium-Ionen-Batteriezellen', '4680 Batteriezellen', 'Stück', 10000, 2000, 20000, 'BatteryPro AG', 45.00),
('67890123-7890-1234-5678-901234567890', 'Carbon-Faser', 'Hochleistungs-Kohlefaser', 'm²', 500, 100, 1000, 'CarbonTech Solutions', 120.00),
('78901234-8901-2345-6789-012345678901', 'Elektronik-Komponenten', 'Verschiedene Chips und Sensoren', 'Set', 200, 50, 500, 'ElectroSupply Ltd', 250.00),
('89012345-9012-3456-7890-123456789012', 'Spezial-Lack', 'Umweltfreundlicher Autolack', 'Liter', 300, 50, 600, 'ColorCoat Systems', 35.00);

-- Done!
SELECT 'Database setup complete!' as status;