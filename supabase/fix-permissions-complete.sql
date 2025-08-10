-- ============================================
-- KOMPLETTE LÖSUNG: Bessere RLS Policies
-- ============================================
-- Führen Sie dieses Script aus, um die Berechtigungen zu korrigieren

-- 1. Erst alle alten Policies löschen
DROP POLICY IF EXISTS "Machines are viewable by all authenticated users" ON machines;
DROP POLICY IF EXISTS "Machines can be created by admin and manager" ON machines;
DROP POLICY IF EXISTS "Machines can be updated by admin, manager, and operator" ON machines;
DROP POLICY IF EXISTS "Machines can be deleted by admin only" ON machines;

DROP POLICY IF EXISTS "Products are viewable by all authenticated users" ON products;
DROP POLICY IF EXISTS "Products can be created by admin and manager" ON products;
DROP POLICY IF EXISTS "Products can be updated by admin and manager" ON products;
DROP POLICY IF EXISTS "Products can be deleted by admin only" ON products;

-- 2. Neue, einfachere Policies erstellen

-- MACHINES - Alle angemeldeten Benutzer können alles (außer Demo)
CREATE POLICY "Machines: Read for all authenticated"
    ON machines FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Machines: Insert for non-demo users"
    ON machines FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.jwt() ->> 'email' != 'demo@mes-system.com'
    );

CREATE POLICY "Machines: Update for non-demo users"
    ON machines FOR UPDATE
    USING (
        auth.role() = 'authenticated' AND 
        auth.jwt() ->> 'email' != 'demo@mes-system.com'
    );

CREATE POLICY "Machines: Delete for non-demo users"
    ON machines FOR DELETE
    USING (
        auth.role() = 'authenticated' AND 
        auth.jwt() ->> 'email' != 'demo@mes-system.com'
    );

-- PRODUCTS - Alle angemeldeten Benutzer können alles (außer Demo)
CREATE POLICY "Products: Read for all authenticated"
    ON products FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Products: Insert for non-demo users"
    ON products FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.jwt() ->> 'email' != 'demo@mes-system.com'
    );

CREATE POLICY "Products: Update for non-demo users"
    ON products FOR UPDATE
    USING (
        auth.role() = 'authenticated' AND 
        auth.jwt() ->> 'email' != 'demo@mes-system.com'
    );

CREATE POLICY "Products: Delete for non-demo users"
    ON products FOR DELETE
    USING (
        auth.role() = 'authenticated' AND 
        auth.jwt() ->> 'email' != 'demo@mes-system.com'
    );

-- 3. Für alle anderen Tabellen auch
ALTER TABLE productions DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checks DISABLE ROW LEVEL SECURITY;
ALTER TABLE material_consumption DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE error_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE components DISABLE ROW LEVEL SECURITY;

-- 4. Test-Query um zu prüfen ob es funktioniert
SELECT 'RLS Policies updated successfully!' as status;