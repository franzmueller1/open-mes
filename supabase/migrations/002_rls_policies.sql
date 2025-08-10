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

-- Employees policies
CREATE POLICY "Employees are viewable by all authenticated users"
    ON employees FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Employees can be created by admin only"
    ON employees FOR INSERT
    WITH CHECK (
        NOT is_demo_user() AND 
        get_user_role() = 'admin'
    );

CREATE POLICY "Employees can be updated by admin only"
    ON employees FOR UPDATE
    USING (
        NOT is_demo_user() AND 
        get_user_role() = 'admin'
    );

CREATE POLICY "Employees can be deleted by admin only"
    ON employees FOR DELETE
    USING (
        NOT is_demo_user() AND 
        get_user_role() = 'admin'
    );

-- Materials policies
CREATE POLICY "Materials are viewable by all authenticated users"
    ON materials FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Materials can be created by admin and manager"
    ON materials FOR INSERT
    WITH CHECK (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager')
    );

CREATE POLICY "Materials can be updated by admin, manager, and operator"
    ON materials FOR UPDATE
    USING (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager', 'operator')
    );

CREATE POLICY "Materials can be deleted by admin only"
    ON materials FOR DELETE
    USING (
        NOT is_demo_user() AND 
        get_user_role() = 'admin'
    );

-- Components policies
CREATE POLICY "Components are viewable by all authenticated users"
    ON components FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Components can be created by admin and manager"
    ON components FOR INSERT
    WITH CHECK (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager')
    );

CREATE POLICY "Components can be updated by admin and manager"
    ON components FOR UPDATE
    USING (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager')
    );

CREATE POLICY "Components can be deleted by admin only"
    ON components FOR DELETE
    USING (
        NOT is_demo_user() AND 
        get_user_role() = 'admin'
    );

-- Productions policies
CREATE POLICY "Productions are viewable by all authenticated users"
    ON productions FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Productions can be created by non-demo users"
    ON productions FOR INSERT
    WITH CHECK (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager', 'operator')
    );

CREATE POLICY "Productions can be updated by non-demo users"
    ON productions FOR UPDATE
    USING (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager', 'operator')
    );

CREATE POLICY "Productions can be deleted by admin and manager"
    ON productions FOR DELETE
    USING (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager')
    );

-- Quality checks policies
CREATE POLICY "Quality checks are viewable by all authenticated users"
    ON quality_checks FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Quality checks can be created by non-demo users"
    ON quality_checks FOR INSERT
    WITH CHECK (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager', 'operator')
    );

CREATE POLICY "Quality checks can be updated by admin and manager"
    ON quality_checks FOR UPDATE
    USING (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager')
    );

CREATE POLICY "Quality checks can be deleted by admin only"
    ON quality_checks FOR DELETE
    USING (
        NOT is_demo_user() AND 
        get_user_role() = 'admin'
    );

-- Material consumption policies
CREATE POLICY "Material consumption is viewable by all authenticated users"
    ON material_consumption FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Material consumption can be created by non-demo users"
    ON material_consumption FOR INSERT
    WITH CHECK (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager', 'operator')
    );

CREATE POLICY "Material consumption can be updated by admin and manager"
    ON material_consumption FOR UPDATE
    USING (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager')
    );

CREATE POLICY "Material consumption can be deleted by admin only"
    ON material_consumption FOR DELETE
    USING (
        NOT is_demo_user() AND 
        get_user_role() = 'admin'
    );

-- Maintenance records policies
CREATE POLICY "Maintenance records are viewable by all authenticated users"
    ON maintenance_records FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Maintenance records can be created by non-demo users"
    ON maintenance_records FOR INSERT
    WITH CHECK (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager', 'operator')
    );

CREATE POLICY "Maintenance records can be updated by admin and manager"
    ON maintenance_records FOR UPDATE
    USING (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager')
    );

CREATE POLICY "Maintenance records can be deleted by admin only"
    ON maintenance_records FOR DELETE
    USING (
        NOT is_demo_user() AND 
        get_user_role() = 'admin'
    );

-- Error reports policies
CREATE POLICY "Error reports are viewable by all authenticated users"
    ON error_reports FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Error reports can be created by all non-demo users"
    ON error_reports FOR INSERT
    WITH CHECK (NOT is_demo_user());

CREATE POLICY "Error reports can be updated by non-demo users"
    ON error_reports FOR UPDATE
    USING (
        NOT is_demo_user() AND 
        get_user_role() IN ('admin', 'manager', 'operator')
    );

CREATE POLICY "Error reports can be deleted by admin only"
    ON error_reports FOR DELETE
    USING (
        NOT is_demo_user() AND 
        get_user_role() = 'admin'
    );